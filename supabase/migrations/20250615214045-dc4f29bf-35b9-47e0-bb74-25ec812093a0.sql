
-- Permite que usuários insiram suas próprias respostas nas pesquisas
CREATE POLICY "Users can insert their own pool responses"
ON public.pool_responses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Permite que usuários vejam suas próprias respostas
CREATE POLICY "Users can view their own pool responses"
ON public.pool_responses
FOR SELECT
USING (auth.uid() = user_id);
