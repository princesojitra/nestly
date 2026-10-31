import React, { useState } from 'react';
import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, Button, Input } from '../../../../shared/components';
import { colors, spacing } from '../../../../shared/theme/tokens';
import { signUpSchema, type SignUpValues } from '../authSchemas';
import { supabaseAuthRepository } from '../../data/supabaseAuthRepository';
import type { AuthStackParamList } from '../../../../app/navigation/AuthStack';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

export function SignUpScreen({ navigation }: Props) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      const result = await supabaseAuthRepository.signUp(values.email, values.password);
      if (result.needsEmailConfirmation) {
        setConfirmationSent(true);
      }
      // else: a session now exists — the AuthProvider listener flips the root
      // navigator to MainTabs on its own.
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Something went wrong');
    }
  });

  if (confirmationSent) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, padding: spacing.xxl, justifyContent: 'center', gap: spacing.md }}>
        <Text variant="title">Check your email</Text>
        <Text variant="body" color={colors.textMuted}>
          We sent a confirmation link. Once confirmed, log in below.
        </Text>
        <Button label="Back to log in" onPress={() => navigation.navigate('SignIn')} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: spacing.xxl, justifyContent: 'center', gap: spacing.md }}>
      <Text variant="title" style={{ marginBottom: spacing.md }}>
        Create your account
      </Text>
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <Input
            label="Email"
            value={field.value}
            onChangeText={field.onChange}
            error={errors.email?.message}
            keyboardType="email-address"
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <Input label="Password" value={field.value} onChangeText={field.onChange} error={errors.password?.message} secureTextEntry />
        )}
      />
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field }) => (
          <Input
            label="Confirm password"
            value={field.value}
            onChangeText={field.onChange}
            error={errors.confirmPassword?.message}
            secureTextEntry
          />
        )}
      />
      {submitError ? (
        <Text variant="caption" color={colors.danger}>
          {submitError}
        </Text>
      ) : null}
      <Button label={isSubmitting ? 'Creating account…' : 'Create account'} onPress={() => onSubmit()} disabled={isSubmitting} />
      <Button label="Already have an account? Log in" variant="secondary" onPress={() => navigation.navigate('SignIn')} />
    </View>
  );
}
