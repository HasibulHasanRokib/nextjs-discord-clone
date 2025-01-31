"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { FileUpload } from "../file-upload";
import {
  createServerSchema,
  TCreateServerSchema,
} from "@/lib/zod-schema/server-schema";
import { useMutation } from "@tanstack/react-query";
import { createServerAction } from "@/actions/createServerActions";
import { Spinner } from "../spinner";
import { ErrorMessage } from "../error-message";
import { SuccessMessage } from "../success-message";
import { useRouter } from "next/navigation";

export function InitialModal() {
  const router = useRouter();

  const form = useForm<TCreateServerSchema>({
    resolver: zodResolver(createServerSchema),
    defaultValues: {
      serverName: "",
      imageUrl: "",
    },
  });

  const { mutate, isPending, data } = useMutation({
    mutationKey: ["create-server"],
    mutationFn: createServerAction,
    onSuccess: (data) => {
      if (data.success) {
        form.reset();
        router.push("/");
      }
    },
  });

  const onSubmit = async (values: TCreateServerSchema) => {
    mutate(values);
  };

  return (
    <>
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <div className="mt-3">
              {data && data.error ? <ErrorMessage message={data.error} /> : ""}
              {data && data.success ? (
                <SuccessMessage message={data.success} />
              ) : (
                ""
              )}
            </div>
            <DialogTitle className="text-2xl">
              Customize your server
            </DialogTitle>
            <DialogDescription>
              Give your server a personality with a name an image. You can
              always change it later.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="serverName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Server name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter server name"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button disabled={isPending} type="submit">
                    {isPending ? <Spinner /> : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
