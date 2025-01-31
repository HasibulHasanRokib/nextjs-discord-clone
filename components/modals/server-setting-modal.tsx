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
import { Settings } from "lucide-react";
import { Server } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { updateServerAction } from "@/actions/server-actions";
import { Spinner } from "../spinner";
import { ErrorMessage } from "../error-message";
import { SuccessMessage } from "../success-message";
import { useRouter } from "next/navigation";

export function ServerSettingModal({
  defaultValues,
}: {
  defaultValues: Server;
}) {
  const router = useRouter();

  const form = useForm<TCreateServerSchema>({
    resolver: zodResolver(createServerSchema),
    defaultValues: {
      serverName: defaultValues.serverName,
      imageUrl: defaultValues.imageUrl,
    },
  });

  const { mutate, isPending, data } = useMutation({
    mutationKey: ["update-server"],
    mutationFn: updateServerAction,
    onSuccess: (data) => {
      if (data.success) {
        router.refresh();
      }
    },
  });

  const onSubmit = async (values: TCreateServerSchema) => {
    const newValues = { ...values, id: defaultValues.id };
    mutate(newValues);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex w-full items-center justify-between">
          Server Setting
          <Settings className="h-4 w-4" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <div className="mt-3">
          {data && data.error ? <ErrorMessage message={data.error} /> : ""}
          {data && data.success ? (
            <SuccessMessage message={data.success} />
          ) : (
            ""
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
                      <Input placeholder="Enter server name" {...field} />
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
