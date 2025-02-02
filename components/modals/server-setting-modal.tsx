"use client";
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
import { createServerSchema, TCreateServerSchema } from "@/lib/zod-schema";

import { useMutation } from "@tanstack/react-query";
import { updateServerAction } from "@/actions/server-actions";
import { Spinner } from "../spinner";
import { ErrorMessage } from "../error-message";
import { SuccessMessage } from "../success-message";
import { useRouter } from "next/navigation";
import { useModal } from "@/store/use-modal-store";
import { ServerWithMemberWithProfile } from "@/lib/types";
import { useEffect } from "react";

export function ServerSettingModal() {
  const { isOpen, type, onClose, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "server-setting";
  const { server } = data as { server: ServerWithMemberWithProfile };

  const form = useForm<TCreateServerSchema>({
    resolver: zodResolver(createServerSchema),
    defaultValues: {
      serverName: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (server) {
      form.setValue("serverName", server.serverName);
      form.setValue("imageUrl", server.imageUrl);
    }
  }, [server, form]);

  const {
    mutate,
    isPending,
    data: mutateData,
  } = useMutation({
    mutationKey: ["update-server"],
    mutationFn: updateServerAction,
    onSuccess: (data) => {
      if (data.success) {
        router.refresh();
      }
    },
  });

  const onSubmit = async (values: TCreateServerSchema) => {
    const newValues = { ...values, id: server.id };
    mutate(newValues);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={() => onClose()}>
      <DialogContent>
        <div className="mt-3">
          {mutateData?.error && <ErrorMessage message={mutateData.error} />}
          {mutateData?.success && (
            <SuccessMessage message={mutateData.success} />
          )}
        </div>
        <DialogHeader>
          <DialogTitle className="text-2xl">Customize your server</DialogTitle>
          <DialogDescription>
            Update your server a personality with a name an image. You can
            always change it later.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button disabled={isPending} type="submit">
                  {isPending ? <Spinner /> : "Update"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
