"use client";

import { useState } from "react";
import { useSignUp, useSignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertCircle,
  Github,
} from "lucide-react";
import Link from "next/link";

export default function CustomSignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { signIn: googleSignIn, isLoaded: googleLoaded } = useSignIn();
  const { signIn: githubSignIn, isLoaded: githubLoaded } = useSignIn();

  // フォーム状態
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // UI状態
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);

  // エラー状態
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [verificationError, setVerificationError] = useState("");

  // パスワード強度チェック
  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const passwordStrength = getPasswordStrength(password);
  const passwordStrengthText = ["弱い", "弱い", "普通", "強い", "非常に強い"];
  const passwordStrengthColor = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ];

  // ソーシャルログイン処理
  const handleGoogleSignUp = async () => {
    if (!googleLoaded) return;

    setIsOAuthLoading(true);
    try {
      await googleSignIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err) {
      console.error("Google認証エラー:", err);
      setErrors({
        general: "Google認証に失敗しました。もう一度お試しください。",
      });
    } finally {
      setIsOAuthLoading(false);
    }
  };

  const handleGithubSignUp = async () => {
    if (!githubLoaded) return;

    setIsOAuthLoading(true);
    try {
      await githubSignIn.authenticateWithRedirect({
        strategy: "oauth_github",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err) {
      console.error("GitHub認証エラー:", err);
      setErrors({
        general: "GitHub認証に失敗しました。もう一度お試しください。",
      });
    } finally {
      setIsOAuthLoading(false);
    }
  };

  // バリデーション
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) {
      newErrors.firstName = "姓を入力してください";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "名を入力してください";
    }

    if (!email.trim()) {
      newErrors.email = "メールアドレスを入力してください";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "有効なメールアドレスを入力してください";
    }

    if (!password) {
      newErrors.password = "パスワードを入力してください";
    } else if (password.length < 8) {
      newErrors.password = "パスワードは8文字以上で入力してください";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "パスワードが一致しません";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // サインアップ処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !isLoaded) return;

    setIsLoading(true);
    setErrors({});

    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      // 名前は create では受け付けられない環境があるため、別途 update で設定
      try {
        await signUp.update({ firstName, lastName });
      } catch (e) {
        // 名前更新は必須ではないため、失敗しても続行
        console.warn("名前更新に失敗しましたが処理を続行します", e);
      }

      // メール確認の送信
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      console.error("サインアップエラー:", err);
      if (err.errors?.[0]?.message) {
        setErrors({ general: err.errors[0].message });
      } else {
        setErrors({
          general: "サインアップに失敗しました。もう一度お試しください。",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // メール確認処理
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationCode.trim() || !isLoaded) return;

    setIsLoading(true);
    setVerificationError("");

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        // ダッシュボードにリダイレクト
        window.location.href = "/sso-callback";
      }
    } catch (err: any) {
      console.error("確認エラー:", err);
      if (err.errors?.[0]?.message) {
        setVerificationError(err.errors[0].message);
      } else {
        setVerificationError(
          "確認コードが正しくありません。もう一度お試しください。"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded || !googleLoaded || !githubLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-lg text-gray-600">読み込み中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {pendingVerification ? "メール確認" : "アカウント作成"}
          </CardTitle>
          <p className="text-sm text-gray-600">
            {pendingVerification
              ? "メールに送信された6桁のコードを入力してください"
              : "AI画像生成サービスを始めましょう"}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {errors.general && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          {!pendingVerification ? (
            <>
              {/* ソーシャルログイン */}
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-50"
                  onClick={handleGoogleSignUp}
                  disabled={isOAuthLoading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {isOAuthLoading ? "処理中..." : "Googleで続ける"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-50"
                  onClick={handleGithubSignUp}
                  disabled={isOAuthLoading}
                >
                  <Github className="w-5 h-5 mr-2" />
                  {isOAuthLoading ? "処理中..." : "GitHubで続ける"}
                </Button>
              </div>

              {/* セパレーター */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">または</span>
                </div>
              </div>

              {/* メールフォーム */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 姓名 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">姓</Label>
                    <Input
                      id="firstName"
                      placeholder="田中"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500">{errors.firstName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">名</Label>
                    <Input
                      id="lastName"
                      placeholder="太郎"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* メールアドレス */}
                <div className="space-y-2">
                  <Label htmlFor="email">メールアドレス</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* パスワード */}
                <div className="space-y-2">
                  <Label htmlFor="password">パスワード</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="8文字以上で入力"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={
                        errors.password ? "border-red-500 pr-10" : "pr-10"
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}

                  {/* パスワード強度インジケーター */}
                  {password && (
                    <div className="space-y-2">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-2 flex-1 rounded-full transition-colors ${
                              level <= passwordStrength
                                ? passwordStrengthColor[passwordStrength - 1]
                                : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600">
                        強度: {passwordStrengthText[passwordStrength - 1]}
                      </p>
                    </div>
                  )}
                </div>

                {/* パスワード確認 */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">パスワード確認</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="パスワードを再入力"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={
                        errors.confirmPassword
                          ? "border-red-500 pr-10"
                          : "pr-10"
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* サインアップボタン */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      作成中...
                    </>
                  ) : (
                    "アカウント作成"
                  )}
                </Button>

                {/* ログインリンク */}
                <p className="text-center text-sm text-gray-600">
                  すでにアカウントをお持ちですか？{" "}
                  <Link
                    href="/sign-in"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    ログイン
                  </Link>
                </p>
              </form>
            </>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              {/* 確認コード入力 */}
              <div className="space-y-2">
                <Label htmlFor="verificationCode">確認コード</Label>
                <Input
                  id="verificationCode"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                />
                {verificationError && (
                  <p className="text-sm text-red-500">{verificationError}</p>
                )}
              </div>

              {/* 確認ボタン */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                disabled={isLoading || !verificationCode.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    確認中...
                  </>
                ) : (
                  "確認"
                )}
              </Button>

              {/* 再送信リンク */}
              <p className="text-center text-sm text-gray-600">
                コードが届かない場合は{" "}
                <button
                  type="button"
                  onClick={() => {
                    signUp.prepareEmailAddressVerification({
                      strategy: "email_code",
                    });
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  再送信
                </button>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
