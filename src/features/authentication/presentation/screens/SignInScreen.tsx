import React, { useState } from 'react';
import { View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, Button, Input } from '../../../../shared/components';
import { colors, spacing } from '../../../../shared/theme/tokens';
import { signInSchema, type SignInValues } from '../authSchemas';
import { supabaseAuthRepository } from '../../data/supabaseAuthRepository';
import type { AuthStackParamList } from '../../../../app/navigation/AuthStack';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignIn'>;

export function SignInScreen({ navigation }: Props) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await supabaseAuthRepository.signIn(values.email, values.password);
      // success: the AuthProvider's onAuthStateChange listener flips the
      // root navigator to MainTabs — no manual navigation needed here.
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Something went wrong');
    }
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: spacing.xxl, justifyContent: 'center', gap: spacing.md }}>
      <Text variant="title" style={{ marginBottom: spacing.md }}>
        Log in
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
      {submitError ? (
        <Text variant="caption" color={colors.danger}>
          {submitError}
        </Text>
      ) : null}
      <Button label={isSubmitting ? 'Logging in…' : 'Log in'} onPress={() => onSubmit()} disabled={isSubmitting} />
      <Button label="Need an account? Sign up" variant="secondary" onPress={() => navigation.navigate('SignUp')} />
    </View>
  );
}
