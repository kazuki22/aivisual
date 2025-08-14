"use client";

import { Button } from "@/components/ui/button";
import { Check, Sparkles, Rocket, ShieldCheck } from "lucide-react";
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
    <div className="container mx-auto py-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold">料金プラン</h1>
        <p className="text-muted-foreground mt-4 text-lg">
          あなたのニーズに合わせて、最適なプランを選択してください。
        </p>
      </div>

      {state.status === "error" && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{state.error}</p>
        </div>
      )}

      {/* {state.status === "success" && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 text-sm hidden">
            セッションが正常に作成されました。
          </p>
        </div>
      )} */}

      <div className="grid lg:grid-cols-3 gap-8 md:grid-cols-1 mx-auto max-w-screen-7xl">
        {plans.map((plan) => {
          const Icon = iconMap[plan.icon as keyof typeof iconMap];
          return (
            <div
              key={plan.name}
              className={`border rounded-xl bg-card p-8 shadow-sm flex flex-col ${
                plan.popular ? "ring-2 ring-primary scale-105" : ""
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 relative">
                  {plan.popular && (
                    <div className="absolute -top-2 -left-2">
                      <div className="rounded-full bg-primary/10 px-3 py-1 text-primary text-sm w-fit">
                        <span className="text-xs">人気プラン</span>
                      </div>
                    </div>
                  )}
                  <Icon className="size-6 text-primary" />
                  <h2 className="text-2xl font-bold">{plan.name}</h2>
                </div>
                <p className="text-center text-muted-foreground">
                  {plan.description}
                </p>

                <div className="flex items-baseline justify-center">
                  <span className="text-2xl font-bold">{plan.price}</span>
                  <span className="ml-2 text-muted-foreground">/月</span>
                </div>

                <ul className="space-y-4 text-sm">
                  <li className="flex items-center gap-3">
                    <Check className="size-4 text-primary" />
                    <span>{plan.features[0]}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="size-4 text-primary" />
                    <span>{plan.features[1]}</span>
                  </li>
                </ul>
              </div>

              <div className="mt-auto pt-8">
                <form action={handleSubmit}>
                  <input name="priceId" value={plan.priceId} type="hidden" />
                  <Button
                    className="w-full"
                    size={"lg"}
                    variant={plan.popular ? "default" : "outline"}
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
  );
};

export default Plan;
