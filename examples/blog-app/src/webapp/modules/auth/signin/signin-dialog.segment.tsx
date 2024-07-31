import { Button, chakra, Dialog, ErrorMessage, Field, IconButton, Input, Label, VStack } from '@chakra-ui/react'
import { HiX } from 'react-icons/hi'
import { SigninDialogProviderToken } from '../tokens.ts'
import { useForm } from '@n2m/forms/react'
import { injectDependency } from '@n2m/core-di'
import { useUnit } from 'effector-react'
import { useProviderShape } from '@n2m/core-modules/react'

export const SigninDialogSegment = () => {
  const { form } = injectDependency(SigninDialogProviderToken)
  const { toggleDialog, isDialogOpen, $signinError } = useProviderShape(SigninDialogProviderToken)
  const { onSubmit } = useUnit(form)
  const { fields } = useForm(form)

  return (
    <Dialog.Root centered open={isDialogOpen} onOpenChange={({ open }) => toggleDialog(open)}>
      <Dialog.Trigger asChild>
        <Button variant="solid" size="md" cursor="pointer">
          Sign In
        </Button>
      </Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.CloseTrigger asChild>
            <IconButton variant="ghost" aria-label="Close">
              <HiX />
            </IconButton>
          </Dialog.CloseTrigger>
          <Dialog.Header>Login</Dialog.Header>
          <Dialog.Body>
            <chakra.form>
              <VStack>
                <Field required>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    aria-required="true"
                    aria-label="Email address"
                    placeholder="Enter your email"
                    value={fields.email.value}
                    onChange={(e) => fields.email.onChange(e.target.value)}
                  />
                </Field>
                <Field invalid={!!$signinError}>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    aria-required="true"
                    aria-label="Password"
                    placeholder="Enter your password"
                    minLength={8}
                    value={fields.password.value}
                    onChange={(e) => fields.password.onChange(e.target.value)}
                  />
                  {/*@ts-expect-error FIXME*/}
                  <ErrorMessage>{$signinError?.response.errors[0]?.message}</ErrorMessage>
                </Field>
              </VStack>
            </chakra.form>
          </Dialog.Body>
          <Dialog.Footer>
            <Button w="full" cursor="pointer" type="submit" onClick={(e) => onSubmit(e as unknown as Event)}>
              LOGIN
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
