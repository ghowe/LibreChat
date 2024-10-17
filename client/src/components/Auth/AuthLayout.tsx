import { useLocalize } from '~/hooks';
import { BlinkAnimation } from './BlinkAnimation';
import { TStartupConfig } from 'librechat-data-provider';
import SocialLoginRender from './SocialLoginRender';
import { ThemeSelector } from '~/components/ui';
import { Banner } from '../Banners';
import Footer from './Footer';

const ErrorRender = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-16 flex justify-center">
    <div
      className="rounded-md border border-red-500 bg-red-500/10 px-3 py-2 text-sm text-gray-600 dark:text-gray-200"
      role="alert"
    >
      {children}
    </div>
  </div>
);

function AuthLayout({
  children,
  header,
  isFetching,
  startupConfig,
  startupConfigError,
  pathname,
  error,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  isFetching: boolean;
  startupConfig: TStartupConfig | null | undefined;
  startupConfigError: unknown | null | undefined;
  pathname: string;
  error: string | null;
}) {
  const localize = useLocalize();

  const DisplayError = () => {
    if (startupConfigError !== null && startupConfigError !== undefined) {
      return <ErrorRender>{localize('com_auth_error_login_server')}</ErrorRender>;
    } else if (error === 'com_auth_error_invalid_reset_token') {
      return (
        <ErrorRender>
          {localize('com_auth_error_invalid_reset_token')}{' '}
          <a className="font-semibold text-green-600 hover:underline" href="/forgot-password">
            {localize('com_auth_click_here')}
          </a>{' '}
          {localize('com_auth_to_try_again')}
        </ErrorRender>
      );
    } else if (error) {
      return <ErrorRender>{localize(error)}</ErrorRender>;
    }
    return null;
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-white dark:bg-gray-900">
      <Banner />
      <BlinkAnimation active={isFetching}>
        <div className="mt-6 h-10 w-full bg-cover">
          <img src="/assets/logo.svg" className="h-full w-full object-contain" alt="Logo" />
        </div>
      </BlinkAnimation>
      <DisplayError />
      <div className="absolute bottom-0 left-0 md:m-4">
        <ThemeSelector />
      </div>

      <div className="flex flex-grow items-center justify-center">
        <div className="w-authPageWidth overflow-hidden bg-white px-6 py-4 dark:bg-gray-900 sm:max-w-md sm:rounded-lg">
          {!startupConfigError && !isFetching && (
            <h1
              className="mb-4 text-center text-3xl font-semibold text-black dark:text-white"
              style={{ userSelect: 'none' }}
            >
              {header}
            </h1>
          )}
          {children}
          <div
            className={`rounded-[10px] border border-[#E958661A] bg-[#E958661A] p-[15px] text-center text-[12px]`}
          >
            <h3 className={`text-[24px] text-[#E95866]`}>Disclaimer</h3>
            <p className={`text-[#E95866]`}>
              “This tool does not provide medical advice It is intended for research & informational
              purposes only. It is not a substitute for professional medical advice, diagnosis or
              treatment. Never ignore professional medical advice in seeking treatment because of
              something you have read on the MyLifeCare.ai Site. If you think you may have a medical
              emergency, immediately call your doctor or dial 911.”
            </p>
          </div>
          {(pathname.includes('login') || pathname.includes('register')) && (
            <SocialLoginRender startupConfig={startupConfig} />
          )}
        </div>
      </div>
      <Footer startupConfig={startupConfig} />
    </div>
  );
}

export default AuthLayout;
