"use client"

import React from 'react'
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { useAuth } from '@clerk/nextjs'

const AuthButton = () => {
    const { userId } = useAuth()

    if (userId) {
        return (
            <SignedIn>
                <UserButton />
            </SignedIn>
        )
    }

  return (
    <div className="flex items-center gap-4">
        <SignInButton
        mode="modal" 
        fallbackRedirectUrl={"/dashboard"}
        forceRedirectUrl={"/dashboard"}
        >
        <Button variant="outline">ログイン</Button>
        </SignInButton>
        <SignUpButton mode="modal"
        fallbackRedirectUrl={"/dashboard"}
        forceRedirectUrl={"/dashboard"}
        >
        <Button variant="default">新規登録</Button>
        </SignUpButton>
    </div>
  )
}

export default AuthButton;