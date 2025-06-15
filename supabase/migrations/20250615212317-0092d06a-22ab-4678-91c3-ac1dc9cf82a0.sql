
-- Permitir que usuários "user" também possam ler a tabela de pesquisas
CREATE POLICY "Users can view all pools" ON public.pools
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('user', 'admin')
    )
  );
