'use client'

import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { useUser } from '@/hooks/use-user'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { InputAnimated } from '../ui/input-animated'

const editUserProfileSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string(),
})

type EditUserProfileSchema = z.infer<typeof editUserProfileSchema>

interface EditProfileDialogProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export default function EditProfileDialog({
  open,
  setOpen,
}: EditProfileDialogProps) {
  const { user, updateUserFn } = useUser()

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<EditUserProfileSchema>({
    resolver: zodResolver(editUserProfileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  })

  async function onSubmit(data: EditUserProfileSchema) {
    if (!user) {
      return
    }
    try {
      await updateUserFn({
        id: user.id,
        email: data.email,
        name: data.name,
      })

      toast.success('Usuário editado com sucesso.', {
        position: 'top-center',
        duration: 3000,
      })

      setOpen(false)
    } catch {
      toast.error('Erro aconteceu ao editar o usuário.', {
        position: 'top-center',
        duration: 3000,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
          <DialogHeader>
            <DialogTitle>Editar perfil</DialogTitle>
            <DialogDescription>
              Faça alterações no seu perfil aqui. Clique em salvar quando
              terminar.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-8">
            <div className="grid gap-1">
              <InputAnimated label="Nome" {...register('name')} />
              {errors.name && (
                <p role="alert" className="text-red-600 text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <InputAnimated label="E-mail" {...register('email')} disabled />
              {errors.email && (
                <p role="alert" className="text-red-600 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => reset()}
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" className="cursor-pointer">
              Salvar alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
