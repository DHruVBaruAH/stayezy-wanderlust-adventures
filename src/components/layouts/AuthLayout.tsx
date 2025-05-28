import { ReactNode } from "react";
import Logo from "@/components/Logo";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className='relative flex min-h-dvh items-center justify-center overflow-hidden bg-primary'>
      {/* Background Elements */}
      <div
        aria-hidden='true'
        className='absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'>
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className='relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-accent opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]'
        />
      </div>
      <div
        aria-hidden='true'
        className='absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]'>
        <div
          className='relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-accent opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]'
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      {/* Content */}
      <div className='flex w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl'>
        {/* Left side - Logo and Welcome */}
        <div className='relative flex w-1/2 flex-col items-center justify-center gap-20 bg-primary px-12 text-white'>
          <div className='absolute top-10 flex items-center gap-3 self-start'>
            <Logo
              size='lg'
              darkMode
            />
          </div>
          <div className='relative self-start'>
            <h1 className='mb-4 text-4xl font-bold'>{title}</h1>
            <p className='select-none text-start text-sm text-white/80'>
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right side - Form */}
        <div className='flex w-1/2 flex-col justify-center bg-white p-12'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
