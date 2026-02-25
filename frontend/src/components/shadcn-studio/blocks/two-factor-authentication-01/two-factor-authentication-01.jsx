import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import Logo from '@/components/shadcn-studio/logo'
import AuthBackgroundShape from '@/assets/svg/auth-background-shape'
import TwoFactorAuthenticationForm from '@/components/shadcn-studio/blocks/two-factor-authentication-01/two-factor-authentication-form'
import { useSelector } from 'react-redux'

const TwoFactorAuthentication = () => {
  const email = useSelector((state) => state.forgot.email);
  return (
    <div
      className='relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8'>
      <div className='absolute'>
        <AuthBackgroundShape />
      </div>
      <Card className='z-1 w-full border-none shadow-md sm:max-w-md'>
        <CardHeader >
          <div>
            <CardTitle className='mb-1.5 text-2xl'>Two Factor Authentication</CardTitle>
            <CardDescription className='text-base'>
              Please confirm access to your account by entering the code sent to {email}.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {/* TwoFactorAuthentication Form */}
          <TwoFactorAuthenticationForm />
        </CardContent>
      </Card>
    </div>
  );
}

export default TwoFactorAuthentication
