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
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod' // IMPORTANTE
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'
import { InputAnimated } from '../ui/input-animated'
import { SelectOverlapping } from '../ui/select-overlapping'
import { updateUser } from '@/api/users/update-user'
import { useQueryClient } from '@tanstack/react-query'

const editUserSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string(),
  role: z.enum(['admin', 'user']),
})

type EditUserSchema = z.infer<typeof editUserSchema>

interface EditUserDialogProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

export default function EditUserDialog({
  open,
  setOpen,
  id,
  name,
  email,
  role,
}: EditUserDialogProps) {
  const queryClient = useQueryClient()
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useForm<EditUserSchema>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name,
      email,
      role,
    },
  })

  async function onSubmit({ email, name, role }: EditUserSchema) {
    try {
      await updateUser({
        id,
        email,
        name,
        role,
      })
      toast.success('Usuário editado com sucesso.', {
        position: 'top-center',
        duration: 3000,
      })

      queryClient.invalidateQueries({ queryKey: ['users'] })

      setOpen(false)
    } catch {
      toast.error('Erro aconteceu ao editar o usuário.', {
        position: 'top-center',
        duration: 3000,
      })

      reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Editar perfil</DialogTitle>
            <DialogDescription>
              Faça alterações no seu perfil aqui. Clique em salvar quando
              terminar.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-1">
              <InputAnimated label="Nome" {...register('name')} />
              {errors.name && (
                <p role="alert" className="text-red-600 text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <InputAnimated label="E-mail" {...register('email')} />
              {errors.email && (
                <p role="alert" className="text-red-600 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Controller
                name="role"
                control={control}
                rules={{ required: 'Selecione um papel' }}
                render={({ field }) => (
                  <SelectOverlapping
                    label="Papel"
                    options={[
                      { value: 'admin', label: 'Administrador' },
                      { value: 'user', label: 'Usuário' },
                    ]}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={errors.role}
                  />
                )}
              />
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
