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
- Invitation audio uses the selected custom track when present, otherwise the bundled classical tune, and only plays when the guest turns it on via the sound button, because autoplay felt intrusive.
- The public home and slug URLs render one JSON-backed invitation directly; the editor is not part of the guest journey.
