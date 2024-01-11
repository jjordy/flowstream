import { Button } from "../components/ui/button";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormLabel,
  FormDescription,
} from "../components/ui/form";

import { Input } from "../components/ui/input";
import { useForm } from "react-hook-form";
import { useLoaderData, useSubmit } from "@remix-run/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";

import { getSession, commitSession } from "../sessions.server";

import { useEffect } from "react";
import { toast } from "sonner";
import { user as userActions } from "../../db/data-repositories/user";
import Layout from "../components/layout";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("userId")) {
    return redirect("/dashboard");
  }
  const data = { error: session.get("error") };

  return json(data, {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const form = await request.formData();
  const username = form.get("email") as string;
  const password = form.get("password") as string;
  const user = await userActions.findBy({ email: username, password });

  if (!user) {
    session.flash("error", "Invalid username/password");
    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  session.set("userId", user.user_id);

  return redirect(user.account_type === "admin" ? "/admin" : "/dashboard", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function LoginRoute() {
  const { error } = useLoaderData<typeof loader>();
  const form = useForm({ defaultValues: { email: "", password: "" } });
  const submit = useSubmit();
  const {
    formState: { isValid },
  } = form;
  useEffect(() => {
    if (error) {
      console.log(error);
      toast(error);
    }
  }, [error]);
  return (
    <Layout>
      <main className="container mx-auto mt-20 flex flex-col items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Use your email address to login to your account
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((v) => submit(v, { method: "post" }))}
              className="space-y-4 w-full"
            >
              <CardContent>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe@gmail.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter your email address!
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="********"
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <FormDescription>Enter your password!</FormDescription>
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={!isValid}>
                  Submit
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </main>
    </Layout>
  );
}
