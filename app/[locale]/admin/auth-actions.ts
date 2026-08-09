"use server";

import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import {
  createAdminSession,
  destroyAdminSession,
  hasAdminCredentialsConfigured,
  verifyAdminCredentials,
} from "@/lib/admin-auth";

export type LoginState = {
  error?: string;
};

export async function loginAdmin(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  if (!hasAdminCredentialsConfigured()) {
    return {
      error: "بيانات الدخول غير مضبوطة في ملف البيئة (.env)",
    };
  }

  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!username.trim() || !password) {
    return { error: "أدخل اسم المستخدم والرمز" };
  }

  if (!verifyAdminCredentials(username, password)) {
    return { error: "اسم المستخدم أو الرمز غير صحيح" };
  }

  await createAdminSession(username.trim());
  const locale = await getLocale();
  redirect({ href: "/admin", locale });
  return {};
}

export async function logoutAdmin(): Promise<void> {
  await destroyAdminSession();
  const locale = await getLocale();
  redirect({ href: "/admin/login", locale });
}
