<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Wedding content lives in the shared `WeddingData` model; templates consume it and own independent visual composition, because new templates must not become palette swaps.
- Invitation audio uses the selected custom track when present and otherwise falls back to the bundled original processional, so every guest experience has music without requiring setup.
