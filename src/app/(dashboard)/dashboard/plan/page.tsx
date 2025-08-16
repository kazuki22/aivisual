"use client";

import { Button } from "@/components/ui/button";
import { Check, Sparkles, Rocket, ShieldCheck, Crown } from "lucide-react";
import React, { useState, useTransition } from "react";
import { plans } from "@/config/plans";
import { createStripeSession } from "@/actions/stripe";

const iconMap = {
  sparkles: Sparkles,
  rocket: Rocket,
  "shield-check": ShieldCheck,
};

type State = {
  status: "idle" | "loading" | "success" | "error";
  error: string;
  sessionUrl?: string;
};

const initialState: State = {
  status: "idle",
  error: "",
};

const Plan = () => {
  const [state, setState] = useState<State>(initialState);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        setState({ status: "loading", error: "" });
        const result = await createStripeSession(state, formData);
        setState(result);

        // 成功時にStripeのチェックアウトページにリダイレクト
        if (result.status === "success" && result.redirectUrl) {
          window.location.href = result.redirectUrl;
        }
      } catch (error) {
        setState({
          status: "error",
          error:
            error instanceof Error ? error.message : "エラーが発生しました",
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20">
      <div className="container mx-auto px-4 py-8">
        <div className="w-full">
          {/* ヘッダーセクション */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4"></div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                料金プラン
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              あなたのニーズに合わせて、最適なプランを選択してください。
            </p>
          </div>

          {state.status === "error" && (
            <div className="mb-8 max-w-2xl mx-auto">
              <div className="rounded-2xl p-6 bg-red-50/80 dark:bg-red-900/20 border-0 shadow-lg backdrop-blur-sm">
                <p className="text-red-600 dark:text-red-400 text-center">
                  {state.error}
                </p>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8 md:grid-cols-1 mx-auto max-w-7xl">
            {plans.map((plan) => {
              const Icon = iconMap[plan.icon as keyof typeof iconMap];
              return (
                <div
                  key={plan.name}
                  className={`rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-lg p-8 flex flex-col transition-all duration-300 hover:scale-105 ${
                    plan.popular
                      ? "ring-2 ring-blue-400 ring-offset-4 ring-offset-white dark:ring-offset-gray-900"
                      : ""
                  }`}
                >
                  <div className="space-y-6">
                    <div className="text-center space-y-4">
                      {plan.popular && (
                        <div className="inline-flex items-center justify-center">
                          <div className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-white text-sm font-semibold">
                            <span>人気プラン</span>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            plan.popular
                              ? "bg-gradient-to-r from-blue-600 to-purple-600"
                              : "bg-gradient-to-r from-blue-600 to-purple-600"
                          }`}
                        >
                          <Icon className="size-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {plan.name}
                        </h2>
                      </div>
                      <p className="text-muted-foreground text-center">
                        {plan.description}
                      </p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {plan.price}
                        </span>
                        <span className="ml-2 text-muted-foreground text-lg">
                          /月
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-4 text-sm">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <Check className="size-3 text-green-600 dark:text-green-400" />
                          </div>
                          <span className="text-gray-700 dark:text-gray-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto pt-8">
                    <form action={handleSubmit}>
                      <input
                        name="priceId"
                        value={plan.priceId}
                        type="hidden"
                      />
                      <Button
                        className={`w-full h-12 text-lg font-semibold transition-all duration-200 ${
                          plan.popular
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                        }`}
                        size={"lg"}
                        type="submit"
                        disabled={isPending}
                      >
                        {isPending ? "処理中..." : plan.buttonText}
                      </Button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plan;
