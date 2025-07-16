const translations = {
  tr: {
    loginTitle: "Giriş Yap",
    loginBtn: "Giriş Yap",
    forgotPass: "Şifremi Unuttum",
    googleLogin: "Google ile Giriş",
    gotoRegister: "Ücretsiz Kaydol",
    registerTitle: "Kayıt Ol",
    registerBtn: "Kayıt Ol",
    gotoLogin: "Girişe Dön"
  },
  en: {
    loginTitle: "Login",
    loginBtn: "Login",
    forgotPass: "Forgot Password",
    googleLogin: "Login with Google",
    gotoRegister: "Register for Free",
    registerTitle: "Register",
    registerBtn: "Register",
    gotoLogin: "Back to Login"
  },
  fa: {
    loginTitle: "ورود",
    loginBtn: "ورود",
    forgotPass: "فراموشی رمز عبور",
    googleLogin: "ورود با گوگل",
    gotoRegister: "ثبت نام رایگان",
    registerTitle: "ثبت نام",
    registerBtn: "ثبت نام",
    gotoLogin: "بازگشت به ورود"
  },
  ar: {
    loginTitle: "تسجيل الدخول",
    loginBtn: "تسجيل الدخول",
    forgotPass: "نسيت كلمة المرور",
    googleLogin: "تسجيل الدخول عبر Google",
    gotoRegister: "سجل مجاناً",
    registerTitle: "إنشاء حساب",
    registerBtn: "سجل",
    gotoLogin: "العودة لتسجيل الدخول"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const switcher = document.getElementById("language-switcher");
  switcher.addEventListener("change", (e) => {
    const selected = e.target.value;
    const allText = document.querySelectorAll("[data-lang]");
    allText.forEach(el => {
      const key = el.getAttribute("data-lang");
      if (translations[selected] && translations[selected][key]) {
        el.innerText = translations[selected][key];
      }
    });
  });
});
