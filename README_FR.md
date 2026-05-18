# EXPOS_UNIV — Version React liée à Supabase

Ce projet contient une plateforme étudiante professionnelle avec Supabase Auth, Database, Storage, Realtime et Row Level Security.

## Démarrage rapide

1. Créez un projet Supabase.
2. Exécutez `supabase/schema.sql` dans SQL Editor.
3. Créez les utilisateurs dans Authentication > Users.
4. Ajoutez les profils admin/student dans `public.profiles`.
5. Créez `.env.local` à partir de `.env.example`.
6. Lancez :

```bash
npm install
npm run dev
```

## Liens après déploiement

- Espace étudiant : `https://votre-domaine.vercel.app`
- Espace administrateur : `https://votre-domaine.vercel.app/admin`

L’accès administrateur dépend du rôle `admin` dans la table `profiles`.
