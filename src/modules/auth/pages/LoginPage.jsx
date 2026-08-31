import LoginForm from '../components/LoginForm';

function LoginPage() {
  return (
    <div className='
      flex
      flex-col
      justify-center
      h-[100dvh]
      bg-zinc-900
      sm:items-center
    '>
      <LoginForm />
    </div>
  );
}

export default LoginPage;
