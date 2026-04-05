import { createFileRoute } from '@tanstack/react-router';

/*
If a user tries to sign in without verifying their email, you can handle the error and show a message to the user.




import { authClient } from "@/lib/auth-client"
await authClient.signIn.email(
  {
    email: "email@example.com",
    password: "password",
  },
  {
    onError: (ctx) => {
      // Handle the error
      if (ctx.error.status === 403) {
        alert("Please verify your email address");
      }
      //you can also show the original error message
      alert(ctx.error.message);
    },
  }
);*/

export const Route = createFileRoute('/_external/auth/login')({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/auth/login"!</div>;
}
