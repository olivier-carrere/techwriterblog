---
draft: false
title: "Strong information typing without the XML overhead"
snippet: "You don’t need the complexity of DITA XML to benefit from its discipline. With Markdown and modern docs-as-code workflows, technical writers can apply strong information typing—tasks, concepts, and references—using lightweight, open tools."
image: {
    src: "/images/blog/strong-information-typing-without-xml-overhead.webp",
    alt: "Illustration of a feather symbolizing Markdown as a lightweight alternative to DITA XML"
}
publishDate: "2025-09-17 11:39"
category: "Blog"
author: "Olivier Carrère"
tags: ["DITA", "Markdown", "Information Typing", "Content Model", "Docs-as-Code"]
---

If you’ve spent years working daily with the DITA XML platform, you know that DITA is more than a markup language. It’s a way of thinking about information design. Writing tasks, concepts, and references in DITA teaches you to break down content into consistent building blocks, which makes documentation easier to navigate, maintain, and reuse.

![XML overhead: A cargo ship](/images/blog/strong-information-typing-without-xml-overhead-large.webp)


The good news is: you don’t need an XML editor or a DITA-OT pipeline to keep practicing those principles. With Markdown and modern docs-as-code workflows, you can implement DITA’s information typing philosophy in a lightweight, flexible way.

## The DITA mindset

DITA trains you to ask:

* **Is this a task?** → A sequence of steps that helps the reader achieve a goal.
* **Is this a concept?** → A piece of explanatory content that builds understanding.
* **Is this a reference?** → A structured lookup table or fact sheet.

Once you’ve internalized this mindset, it becomes natural to apply it even outside XML. Markdown pages, Git-based workflows, and static site generators all benefit when you keep these categories clear.

## Implementing DITA types in Markdown

### Task Pages

DITA task topics have strict rules: short context, prerequisites, ordered steps, results. You can recreate this in Markdown easily:

```markdown
# How to Configure the API Client

## Prerequisites
- Installed the API client
- Generated an API key

## Steps
1. Open the configuration file.
2. Add your API key under `[auth]`.
3. Save and restart the client.

## Result
The client authenticates automatically with your API key.
```

This keeps the procedural content focused and predictable, just like in DITA.

### Concept Pages

Concepts explain “what” and “why” rather than “how.” In Markdown, you can still signal that you’re writing a concept by structuring around definition and explanation.

```markdown
# Understanding API Rate Limits

API rate limits control how many requests a client can make in a given timeframe.  
They protect the server from overload and ensure fair access for all users.

## Key Points
- Rate limits vary per endpoint.
- Exceeding limits results in error `429: Too Many Requests`.
- You can check your remaining quota in the response headers.
```

The structure shows it’s an explanatory page, not a step-by-step guide.

### Reference Pages

References benefit from structured tables and lists. Markdown supports both:

```markdown
# API Error Codes

| Code | Meaning               | Resolution                       |
|------|-----------------------|----------------------------------|
| 401  | Unauthorized          | Check your API key.              |
| 404  | Not Found             | Verify the endpoint URL.         |
| 500  | Internal Server Error | Try again later or contact support. |
```

This mirrors a DITA reference topic: concise, tabular, and easy to scan.

## Why this matters

DITA XML can feel heavy to implement in modern docs pipelines. But the discipline you develop with years of daily practice doesn’t vanish when you move to Markdown. Instead, it becomes a superpower.

By bringing DITA’s principles into lightweight environments, you:

* Keep content modular and reusable.
* Reduce ambiguity for readers.
* Simplify onboarding for new writers.
* Make your documentation friendlier to automation and AI-assisted tools.

DITA taught us to think in types, not just topics. Markdown lets us practice that thinking with less overhead, using tools that integrate smoothly into today’s development workflows.

If you’ve worked in DITA for years, don’t see that experience as “outdated.” It’s the foundation for building smarter, cleaner, and more maintainable docs-as-code content today.
