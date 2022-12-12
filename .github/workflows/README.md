# Execute locally

```
act push -a jboxman --secret-file=.secrets -e push.json
```

A tag must be specified in `push.json`:

```json
{
  "ref": "refs/tags/v1.0.0"
}
```

And the secrets file must specify a GitHub personal access token, such as:

```
GITHUB_TOKEN=ghp_s...
```
