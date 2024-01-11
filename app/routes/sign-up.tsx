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

import { nanoid } from "nanoid";

import { useEffect } from "react";
import { toast } from "sonner";

import { user } from "../../db/data-repositories/user";
import { generatePasswordHash } from "../lib/auth";

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
  const username = form.get("email");
  const password = form.get("password");
  const confirmPassword = form.get("confirm_password");

  if (password !== confirmPassword) {
    session.flash("error", "Passwords must match");
    // Redirect back to the login page with errors.
    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  const data = await user.create({
    user_id: nanoid(),
    email: username as string,
    account_type: "user",
    password: generatePasswordHash(password! as string),
  });

  session.set("userId", data.user_id as string);

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function SignUpRoute() {
  const { error } = useLoaderData<typeof loader>();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
      first_name: "",
      last_name: "",
    },
  });
  const submit = useSubmit();
  const {
    formState: { isValid },
  } = form;
  useEffect(() => {
    if (error) {
      toast(error);
    }
  }, [error]);
  return (
    <main className="container mx-auto mt-20 flex flex-col items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>
            Enter your information to create an account!
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((v) => submit(v, { method: "post" }))}
            className="space-y-4 w-full"
          >
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter your email address!
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter your email address!
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe@gmail.com" {...field} />
                    </FormControl>
                    <FormDescription>Enter your email address!</FormDescription>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                {" "}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input placeholder="********" {...field} />
                      </FormControl>
                      <FormDescription>Enter your password!</FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input placeholder="********" {...field} />
                      </FormControl>
                      <FormDescription>Enter your password!</FormDescription>
                    </FormItem>
                  )}
                />
              </div>
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
  );
}
