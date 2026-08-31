import SignupForm from '../components/SignupForm';

function SignupPage() {
  return (
    <div className='
      flex
      flex-col
      justify-start
      min-h-screen
      h-screen
      overflow-y-auto
      py-12
      px-4
      items-center
      bg-zinc-900
    '>
      <SignupForm />
    </div>
  );
}

export default SignupPage;
