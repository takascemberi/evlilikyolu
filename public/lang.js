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
    gotoLogin: "بازگشت"
  },
  ar: {
    loginTitle: "تسجيل الدخول",
    loginBtn: "دخول",
    forgotPass: "نسيت كلمة المرور؟",
    googleLogin: "تسجيل بواسطة جوجل",
    gotoRegister: "إنشاء حساب",
    registerTitle: "التسجيل",
    registerBtn: "سجل الآن",
    gotoLogin: "عودة لتسجيل الدخول"
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
