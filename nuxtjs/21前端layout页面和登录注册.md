## 前端

### utils(公用模块)

在`~/utils`目录下定义

#### userSchema(userSchema.ts)

在`~/utils/userSchema.ts`中定义`schema`

```ts
import zod from "zod";

export const userSchema = zod.object({
  username: zod.string().optional(), // 用户名
  code: zod.string().min(6, { message: "请输入6位数验证码" }).optional(), // 验证码
  email: zod.string().email({ message: "请输入正确的邮箱地址" }), // 账号，也是邮箱
  password: zod
    .string()
    .min(6, { message: "密码不能少于6位" })
    .max(30, { message: "密码不能大于30位" }), // 密码
  phone: zod
    .string()
    .optional()
    .refine(
      (value) => {
        // 如果值为空，则通过验证
        if (!value) return true;
        // 验证电话号码格式（示例：+1[3-9]xxxx 或 123-456-7890 等）
        return /^1[3-9]\d{9}$/.test(value) || /^\d{3}-\d{3}-\d{4}$/.test(value);
      },
      { message: "请输入正确的手机号" }
    ), // 手机号
  avatar: zod.string().optional(), // 头像
  role: zod.string().default("user"), // 角色
  status: zod.number().optional().default(1), // 状态
  createTime: zod.date().optional(), // 创建时间
  updateTime: zod.date().optional(), // 更新时间
  lastLoginTime: zod.date().optional(), // 最后登录时间
  disable: zod.boolean().optional(), // 禁用
  // mongo自带属性
  createdAt: zod.date().optional(), // 创建时间
  updatedAt: zod.date().optional(), // 更新时间
  _id: zod.any().optional(), // id
});

export type User = zod.infer<typeof userSchema>;
```

#### 前后端路由白名单(whiteRoute.ts)

在`~/utils/whiteRoute.ts`

```ts
export default {
  // 前端
  frontend: ["/login", "/register", "/404"],
  // 后端
  backend: ["/api/user/login", "/api/user/register", "/api/utils/registerCode"],
};
```

### 状态管理(user.ts)

在`~/stores/user.ts`中定义状态管理

```ts
import type { User } from "~/utils/userSchema";

export const userStore = defineStore("user", {
  state: () => ({
    userData: null as User | null,
  }),
  actions: {
    /**
     * 获取个人资料
     * @returns
     */
    async getUserData() {
      const { data, error } = await useFetch<any>("/api/user/getUserData", {
        lazy: true,
      });
      if (error.value || data.value?.code != 200) {
        this.userData = null;
        return;
      }
      this.userData = data.value?.data as User | null;
    },
    /**
     * 退出登录
     */
    async loginout() {
      try {
        await $fetch("/api/user/loginout");
        this.userData = null;
        useToast().add({
          title: "提示",
          description: "退出登录成功",
          color: "success",
        });
        navigateTo("/login", {
          replace: true,
        });
      } catch (error: any) {
        useToast().add({
          title: "提示",
          description: error.data?.message || "退出登录失败",
          color: "error",
        });
      }
    },
  },
});
```

### 路由权限中间件(auth.global.ts)

在`~/middlemare/auth.global.ts`

```ts
import whiteRoute from "~/utils/whiteRoute";
export default defineNuxtRouteMiddleware(async (to, from) => {
  // 是否需要验证的白名单
  const whilePathList = whiteRoute.frontend;
  // 是否登录过
  const token = useCookie("token");
  const store = userStore();

  if (whilePathList.includes(to.path)) {
    return;
  } else {
    if (!token.value) {
      return navigateTo("/login");
    } else {
      if (store.userData) {
        return;
      }
      try {
        // 获取用户信息
        await userStore().getUserData();
      } catch (error) {
        console.log(error, "error---------");
      }
    }
    return;
  }
});
```

### app.vue 编写

```vue
<template>
  <div class="full-screen">
    <!-- 加载指示器, 也就是跳转路由时的加载动画 -->
    <NuxtLoadingIndicator />

    <!-- 路由切换动画 -->
    <NuxtRouteAnnouncer />

    <NuxtLayout>
      <!-- nuxtui使用UApp来包裹，可使用国际化和其他 -->
      <UApp>
        <NuxtPage />
      </UApp>
    </NuxtLayout>
  </div>
</template>
<script lang="ts" setup></script>
<style>
.full-screen {
  width: 100vw; /* 视口宽度 */
  height: 100vh; /* 视口高度 */
  margin: 0;
  padding: 0;
  overflow: hidden; /* 不允许内容滚动 */
}
</style>
```

### 编写 layout

在`~/layouts`目录中直接, 可以有多个页面，默认是`default.vue`, 如果需要其他特殊配置，需要通过`definePageMeta({layout: 'xxx'})`指定

#### 默认 layout(default.vue)

该页面作为所有页面的默认布局

```vue
<template>
  <div class="flex flex-col h-full w-full">
    <div
      class="layout-contaner flex justify-between px-4 py-4 items-center"
      :class="[
        isDark ? 'border-b-white shadow-white' : 'border-b-gray-400 shadow',
      ]"
    >
      <ULink as="button" class="text-blue-500">Nuxt UI</ULink>
      <div class="flex items-center">
        <ClientOnly v-if="!colorMode?.forced">
          <UButton
            class="mr-3"
            :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
            color="neutral"
            variant="ghost"
            @click="isDark = !isDark"
          />

          <template #fallback>
            <div class="size-8" />
          </template>
        </ClientOnly>
        <UDropdownMenu :items="dropitems">
          <UAvatar :src="userData?.avatar" size="lg" icon="line-md:account" />
        </UDropdownMenu>
      </div>
    </div>
    <div class="flex-1 flex">
      <div class="sidebar w-[250px] border-r border-gray-400 py-2 px-3">
        <Slider />
      </div>
      <div class="flex-1 px-2 py-3">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { userStore } from "#imports";
import type { DropdownMenuItem } from "@nuxt/ui";

const userData = userStore().userData;
const dropitems: DropdownMenuItem[][] = [
  [
    {
      label: userData?.username || userData?.email || "未设置",
      avatar: {
        src: userData?.avatar || "",
      },
      icon: "line-md:account",
      type: "label",
    },
  ],
  [
    {
      label: "编辑个人资料",
      icon: "line-md:file-document-twotone",
      type: "link",
      onClick: async () => {
        console.log("编辑个人资料");
      },
    },
    {
      label: "退出登录",
      icon: "line-md:arrow-right-square",
      type: "link",
      onClick: async () => {
        const store = userStore();
        await store.loginout();
      },
    },
  ],
];

const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(_isDark: any) {
    colorMode.preference = _isDark ? "dark" : "light";
  },
});
</script>

<style scoped></style>
```

#### 无头部页面(full-screen.vue)

如果不需要用到`基本布局`, 可以直接使用`full-screen.vue`

```vue
<template>
  <div class="w-full h-full px-4 py-4">
    <slot></slot>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
```

### slider 侧边栏

在`~/components/slider.vue`

```vue
<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const items = ref<NavigationMenuItem[][]>([
  [
    {
      label: "Links",
      type: "label",
    },
    {
      label: "Guide",
      icon: "i-lucide-book-open",
      children: [
        {
          label: "Introduction",
          description: "Fully styled and customizable components for Nuxt.",
          icon: "i-lucide-house",
        },
        {
          label: "Installation",
          description:
            "Learn how to install and configure Nuxt UI in your application.",
          icon: "i-lucide-cloud-download",
        },
        {
          label: "Icons",
          icon: "i-lucide-smile",
          description:
            "You have nothing to do, @nuxt/icon will handle it automatically.",
        },
        {
          label: "Colors",
          icon: "i-lucide-swatch-book",
          description:
            "Choose a primary and a neutral color from your Tailwind CSS theme.",
        },
        {
          label: "Theme",
          icon: "i-lucide-cog",
          description:
            "You can customize components by using the `class` / `ui` props or in your app.config.ts.",
        },
      ],
    },
  ],
  [
    {
      label: "GitHub",
      icon: "i-simple-icons-github",
      badge: "3.8k",
      to: "https://github.com/nuxt/ui",
      target: "_blank",
    },
    {
      label: "Help",
      icon: "i-lucide-circle-help",
      disabled: true,
    },
  ],
]);
</script>

<template>
  <UNavigationMenu orientation="vertical" :items="items" class="w-full" />
</template>
```

### 注册页

在`~/pages/register.vue`

```vue
<template>
  <div class="flex justify-center items-center flex-col w-full h-full">
    <UForm :schema="userSchema" :state="userData" @submit="onSubmit">
      <UFormField
        label="账号"
        name="email"
        class="flex items-center gap-4"
        placeholder="请输入账号"
        :ui="{
          labelWrapper: 'flex items-center gap-4',
          label: 'w-[50px] text-right',
        }"
      >
        <UInput v-model="userData.email" />
      </UFormField>
      <div class="flex justify-between items-center mt-[15px]">
        <UFormField
          label="验证码"
          name="code"
          class="flex items-center gap-4"
          placeholder="请输入验证码"
          ,
          :ui="{
            labelWrapper: 'flex items-center gap-4',
            label: 'w-[50px] text-right',
          }"
        >
          <UInput v-model="userData.code" />
        </UFormField>
        <UButton
          color="secondary"
          :disabled="isSendCode"
          :loading="isSendCode"
          @click="sendCode"
          >{{ isSendCode ? sendTime : "获取验证码" }}</UButton
        >
      </div>
      <UFormField
        label="密码"
        name="password"
        class="flex items-center gap-4 mt-[15px]"
        placeholder="请输入密码"
        :ui="{
          labelWrapper: 'flex items-center gap-4',
          label: 'w-[50px] text-right',
        }"
      >
        <UInput v-model="userData.password" type="password" />
      </UFormField>
      <div class="mt-[15px] flex justify-center">
        <UButton class="mr-[15px]" to="/login"> 登录 </UButton>
        <UButton type="submit"> 注册 </UButton>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { userSchema } from "~/utils/userSchema";
import type { User } from "~/utils/userSchema";
import type { FormSubmitEvent } from "@nuxt/ui";

// 设置单独页面
definePageMeta({
  layout: "full-screen",
});

const userData = reactive<Partial<User>>({
  email: "",
  password: "",
});
// 是否发送过验证码
const isSendCode = ref(false);
const sendTime = ref(60);
const sendTimer = ref<null | any>(null);

const toast = useToast();
// 提交
async function onSubmit(event: FormSubmitEvent<User>) {
  // 验证码
  if (!event.data?.code) {
    toast.add({
      title: "提示",
      description: "请输入验证码",
      color: "error",
    });
    return;
  }
  try {
    await $fetch("/api/user/register", {
      method: "POST",
      body: event.data,
    });
    toast.add({
      title: "提示",
      description: "注册成功,两秒后跳转登录...",
      color: "success",
    });
    resetTimer();
    setTimeout(() => {
      // 重定向到登录页
      navigateTo("/login", { replace: true });
    }, 2000);
  } catch (error: any) {
    toast.add({
      title: "提示",
      description: error?.data?.message || "注册失败",
      color: "error",
    });
  }
}

const resetTimer = () => {
  isSendCode.value = false;
  clearInterval(sendTimer.value);
  sendTime.value = 60;
};

// 发送验证码
const sendCode = async () => {
  try {
    const res: any = await $fetch("/api/utils/registerCode");
    toast.add({
      title: "提示",
      description: res.message,
      color: "success",
    });
    isSendCode.value = true;
    sendTimer.value = setInterval(() => {
      if (sendTime.value == 1) {
        resetTimer();
      } else {
        sendTime.value--;
      }
    }, 1000);
  } catch (error: any) {
    toast.add({
      title: "提示",
      description: error?.data?.message || "获取验证码失败",
      color: "error",
    });
    resetTimer();
  }
};
</script>

<style scoped></style>
```

### 登录页

在`~/pages/login.vue`

```vue
<template>
  <div class="flex justify-center items-center flex-col w-full h-full">
    <UForm :schema="userSchema" :state="userData" @submit="onSubmit">
      <UFormField
        label="账号"
        name="email"
        class="flex items-center gap-4"
        placeholder="请输入账号"
        :ui="{
          labelWrapper: 'flex items-center gap-4',
          label: 'w-[50px] text-right',
        }"
      >
        <UInput v-model="userData.email" />
      </UFormField>

      <UFormField
        label="密码"
        name="password"
        class="flex items-center gap-4 mt-[15px]"
        placeholder="请输入密码"
        :ui="{
          labelWrapper: 'flex items-center gap-4',
          label: 'w-[50px] text-right',
        }"
      >
        <UInput v-model="userData.password" type="password" />
      </UFormField>
      <div class="mt-[15px] flex justify-between">
        <ULink to="/register">注册</ULink>
        <UButton type="submit"> 登录 </UButton>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { userSchema } from "~/utils/userSchema";
import type { User } from "~/utils/userSchema";
import type { FormSubmitEvent } from "@nuxt/ui";

// 设置单独页面
definePageMeta({
  layout: "full-screen",
});

const userData = reactive<Partial<User>>({
  email: "",
  password: "",
});

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<User>) {
  try {
    // console.log(event.data);
    // return;
    await $fetch("/api/user/login", {
      method: "POST",
      body: event.data,
    });
    toast.add({
      title: "提示",
      description: "登录成功, 2秒后跳转首页",
      color: "success",
    });
    setTimeout(() => {
      // 重定向到首页
      navigateTo("/", { replace: true });
    }, 2000);
  } catch (error: any) {
    toast.add({
      title: "提示",
      description: error?.data?.message || "登录失败",
      color: "error",
    });
  }
}
</script>

<style scoped></style>
```

### 主页(暂时不写)

在`~/pages/index.vue`

```vue
<template>
  <div>首页</div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
```
