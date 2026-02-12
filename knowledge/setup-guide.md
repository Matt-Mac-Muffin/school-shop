# Guide de mise en route

Le setup developpeur est documente dans `README.md` (section **Get Started**).
Les etapes de deploiement et production sont dans `NEXTSTEPS.md`.

## Notes complementaires

- `ng serve` (port 4200) ne lance que le front Angular, sans les Netlify Functions. Utiliser `netlify dev` (port 8888) pour avoir le front + l'API.
- Les cles Supabase ont change de format en 2025 : `sb_publishable_...` remplace l'ancienne `anon` key (JWT), `sb_secret_...` remplace `service_role`. Les deux formats fonctionnent avec `supabase-js`.
- Carte de test Stripe : `4242 4242 4242 4242` (date future, CVC quelconque).
