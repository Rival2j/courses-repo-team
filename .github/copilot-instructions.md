# Supabase project rules

- Use the Supabase MCP server only for the project `xqtfovmmndsloqnyqhfv`.
- Treat `cursos` as the default and only schema for application work.
- Never query, create, or modify tables, views, functions, triggers, or grants outside `cursos` unless the user explicitly asks for a different schema.
- When writing SQL, qualify objects with `cursos.` and prefer `set search_path to cursos` only for local verification scripts.
- If a request would touch another schema, stop and call that out before proceeding.
