---
outline: deep
prev:
  text: "oss云存储"
  link: "/node/oss"
next:
  text: "fastify框架"
  link: "/node/fastify"
---

## libuv

在 Node.js 中，libuv 是作为其事件循环和异步 I/O 的核心组件而存在的。Node.js 是构建在 libuv 之上的，它利用 libuv 来处理底层的异步操作，如文件 I/O、网络通信和定时器等

### libuv 在 js 中的作用

1. `事件循环（Event Loop）`：libuv 实现了 Node.js 的事件循环机制，负责管理事件的调度和执行。
   事件循环是 Node.js 的核心机制，它使得 Node.js 能够以非阻塞的方式处理大量并发操作
2. `异步I/O操作`：libuv 提供了一组异步 I/O 的 API，用于处理文件、网络和其他 I/O 操作。这些 API 能够在后台进行操作，而无需阻塞主线程，从而实现高效的并发处理
3. `网络通信`：libuv 封装了底层的网络通信功能，包括 TCP 和 UDP 套接字的创建、绑定、监听和连接等操作。它提供了高级的网络接口，方便开发者构建基于网络的应用程序
4. `定时器和事件触发`：libuv 提供了定时器相关的 API，可以创建和管理定时器，以及在指定时间间隔后触发相应的回调函数。这对于处理定时任务和调度是非常有用的
5. `跨平台支持`：libuv 实现了对不同操作系统的抽象封装，使得 Node.js 能够在不同的平台上运行，并保持一致的行为和性能

## 事件循环

在 Nodejs 中，事件循环分为` 6 个阶段`。每个阶段都有一个任务队列, 详情请看
[官方的事件循环机制解析](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)
![libuv事件循环流程图](/libuv事件循环流程图.jpg)

### 宏任务(事件循环阶段)

1. `timers`: 执行 setTimeout 和 setInterval 的回调
2. `pending callbacks`: 执行推迟的回调如 IO，计时器(node 内部执行)
3. `idle，prepare`: 空闲状态 nodejs 内部使用无需关心(node 内部执行)
4. `poll`: 执行与 I/O 相关的回调（除了关闭回调、计时器调度的回调和 setImmediate 之外，几乎所有回调都执行） 例如 fs 的回调 http 回调
5. `check`: 执行 setImmediate 的回调
6. `close callback`: 执行例如 socket.on('close', ...) 关闭的回调

### 微任务

1. process.nextTick
2. promise

### 不准确性

在事件循环的每个循环迭代中，libuv 会调用`uv__update_time函数`来更新当前的时间戳。
这个时间戳通常用于计算定时器的超时时间和检查事件的发生时间，而 `setImmediate`，则是把回调函数直接插入队列，所以执行效率比较高。
所以就会造成顺序不稳定的一个原因

## 源码解析

`git上的libuv源码路径：libuv/src/unix/core.c`

```c
int uv_run(uv_loop_t* loop, uv_run_mode mode) {
  int timeout;
  int r;
  int can_sleep;

  r = uv__loop_alive(loop); //检查事件循环是否活跃
  if (!r) //如果事件循环不活跃，直接返回
    uv__update_time(loop); //调用这个函数更新时间戳去检查计时器 超时时间 耗时

  /* Maintain backwards compatibility by processing timers before entering the
   * while loop for UV_RUN_DEFAULT. Otherwise timers only need to be executed
   * once, which should be done after polling in order to maintain proper
   * execution order of the conceptual event loop. */
  if (mode == UV_RUN_DEFAULT && r != 0 && loop->stop_flag == 0) {
    uv__update_time(loop); //更新时间
    uv__run_timers(loop); //执行定时器
  }

  while (r != 0 && loop->stop_flag == 0) {
    can_sleep =
        uv__queue_empty(&loop->pending_queue) &&
        uv__queue_empty(&loop->idle_handles);

    uv__run_pending(loop); //执行事件队列中的事件
    uv__run_idle(loop); //执行空闲队列中的事件
    uv__run_prepare(loop); //执行预备队列中的事件

    timeout = 0;
    if ((mode == UV_RUN_ONCE && can_sleep) || mode == UV_RUN_DEFAULT)
      timeout = uv__backend_timeout(loop);

    uv__metrics_inc_loop_count(loop);

    uv__io_poll(loop, timeout); //执行事件循环

    /* Process immediate callbacks (e.g. write_cb) a small fixed number of
     * times to avoid loop starvation.*/
    for (r = 0; r < 8 && !uv__queue_empty(&loop->pending_queue); r++)
      uv__run_pending(loop);

    /* Run one final update on the provider_idle_time in case uv__io_poll
     * returned because the timeout expired, but no events were received. This
     * call will be ignored if the provider_entry_time was either never set (if
     * the timeout == 0) or was already updated b/c an event was received.
     */
    uv__metrics_update_idle_time(loop); //更新空闲时间

    uv__run_check(loop); //执行检查队列中的事件 setImmediate
    uv__run_closing_handles(loop); //执行关闭队列中的事件

    uv__update_time(loop); //更新时间
    uv__run_timers(loop); //执行定时器

    r = uv__loop_alive(loop);
    if (mode == UV_RUN_ONCE || mode == UV_RUN_NOWAIT)
      break;
  }
```

## uv\_\_update_time 函数实现

`git上的libuv源码路径：libuv/src/unix/internal.c`

```c
UV_UNUSED(static void uv__update_time(uv_loop_t* loop)) {
  /* Use a fast time source if available.  We only need millisecond precision.
   */
 // 这个函数通过调用 `gethrtime` 获取系统当前时间，精度非常高，单位是纳秒（ns），
 // 1 纳秒等于十亿分之一秒。除 `1000000` 后的时间单位为 毫秒（ms）
  loop->time = uv__hrtime(UV_CLOCK_FAST) / 1000000;
}
```

## 注意事项

:::warning 注意事项
在 ` nodejs 不同版本``微任务 `执行策略不同, `低版本` `nextTick` 优先于 `Promise`, 高版本则相反
:::
