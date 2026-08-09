"use client";

import { useActionState } from "react";
import { loginAdmin, type LoginState } from "@/app/[locale]/admin/auth-actions";
import { Alert, Button, Field, Input } from "@/components/admin/form-ui";

const initialState: LoginState = {};

export function AdminLoginForm() {
  const [state, action, pending] = useActionState(loginAdmin, initialState);

  return (
    <form action={action} className="mx-auto w-full max-w-md space-y-5">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-cream">دخول لوحة التحكم</h1>
        <p className="text-sm text-muted">أدخل اسم المستخدم والرمز للمتابعة</p>
      </div>

      {state.error && <Alert>{state.error}</Alert>}

      <Field label="اسم المستخدم" htmlFor="username">
        <Input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          disabled={pending}
        />
      </Field>

      <Field label="الرمز" htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={pending}
        />
      </Field>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "جارٍ التحقق..." : "دخول"}
      </Button>
    </form>
  );
}
