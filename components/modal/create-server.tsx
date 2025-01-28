"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createServer, TCreateServer } from "@/lib/zod/server-validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

export function CreateServer() {
  const form = useForm<TCreateServer>({
    resolver: zodResolver(createServer),
    defaultValues: {
      serverName: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (values: TCreateServer) => {
    console.log(values);
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Create server</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
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
                  name="serverName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Server name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter server name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Save </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
