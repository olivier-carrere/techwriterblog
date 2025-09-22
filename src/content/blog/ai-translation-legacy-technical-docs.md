---
draft: false
title: "An AI-based workflow to translate legacy content"
snippet: "Translating legacy documentation is costly and time-consuming. This post shows how I combined DeepL, GPT-4o, and a bit of manual editing to efficiently translate French Markdown files into polished English—good enough for legacy content and easy to iterate."
image: {
    src: "/images/blog/ai-translation-legacy-technical-docs.webp",
    alt: "Illustration of AI-assisted translation of technical documentation"
}
publishDate: "2025-09-22 01:00"
category: "Blog"
author: "Olivier Carrère"
tags: [AI, Translation, Technical Writing, Markdown, DeepL, GPT-4o]
---

Translating large sets of legacy documentation is always a challenge. Professional human translation ensures quality, but it is time-consuming and costly—especially when dealing with dozens or even hundreds of Markdown files, diagrams, and embedded metadata.

For my [Redaction Technique legacy website](https://docs.redaction-technique.org/fr/), I developed an **AI-based iterative workflow** that automates much of the heavy lifting while still leaving space for human refinement.

![Plastic colorful springs illustrating iterative workflows](/images/blog/ai-translation-legacy-technical-docs-large.webp)

Like most efficient processes, it relies on iteration: a loop that combines different AI tools to enable steady, incremental publishing. Human intervention remains critical at every stage—guiding the process, correcting errors, and keeping the results on track. The final step is a thorough human correction, which can sometimes be deferred for legacy or non-critical content until analytics confirm that the material is worth the extra investment.

## Automatic translation with DeepL

The first step is to generate raw English translations of all French Markdown files. For this, I wrote a simple Python script that:

* Scans the current directory for **.md** files.
* Sends the content to the [DeepL API](https://www.deepl.com/docs-api) for translation (French → English).
* Saves the output as a new file with the suffix **-en.md**.

```python
import os
import requests

DEEPL_API_KEY = "YOUR_DEEPL_API_KEY"
DEEPL_API_URL = "https://api-free.deepl.com/v2/translate"

def translate_text(text, source_lang="FR", target_lang="EN"):
    response = requests.post(
        DEEPL_API_URL,
        data={
            "auth_key": DEEPL_API_KEY,
            "text": text,
            "source_lang": source_lang,
            "target_lang": target_lang
        },
    )
    response.raise_for_status()
    return response.json()["translations"][0]["text"]

def translate_markdown_files():
    for filename in os.listdir("."):
        if filename.endswith(".md") and not filename.endswith("-en.md"):
            print(f"Translating {filename}...")
            with open(filename, "r", encoding="utf-8") as f:
                content = f.read()

            translated = translate_text(content)
            new_filename = filename[:-3] + "-en.md"

            with open(new_filename, "w", encoding="utf-8") as f:
                f.write(translated)

            print(f"Created {new_filename}")

if __name__ == "__main__":
    translate_markdown_files()
```

This produces usable English content quickly, but the results often contain **broken Markdown tables**, **mismatched frontmatter**, or literal translations that sound clumsy.


```diff
commit 3fbbc6d22ae2b2b573df984189a557d65e641f51
Author: Olivier Carrère <xxx@xxx.xxx>
Date:   Sat Sep 20 18:32:27 2025 +0200

    Fix tables

diff --git a/src/content/docs/en/veille/raspberry-pi-plateforme-documentation.md b/src/content/docs/en/veille/raspberry-pi-plateforme-documentation.md
index 9592b89c..ea635253 100644
--- a/src/content/docs/en/veille/raspberry-pi-plateforme-documentation.md
+++ b/src/content/docs/en/veille/raspberry-pi-plateforme-documentation.md
@@ -64,14 +64,14 @@ The aims of this post are to:
 
    The following software is installed:
 
-    | Software | Description |
-    |----------------|----------------------------------------------------------|
-    | Calibre | Digital Book Manager.
-    | Emacs Integrated Development Environment.
-    | Gitk | Decentralized version control software history browser.
-    | Inkscape Vector drawing software.
-    | Python Sphinx | Documentation generator based on reStructuredText format.
-    | Texlive | Complete LaTeX environment for PDF blog generation.
+    | Software      | Description                                               |
+    |---------------|-----------------------------------------------------------|
+    | Calibre       | Digital Book Manager.                                     |
+    | Emacs         | Integrated Development Environment.                       |
+    | Gitk          | Decentralized version control software history browser.   |
+    | Inkscape      | Vector drawing software.                                  |
+    | Python Sphinx | Documentation generator based on reStructuredText format. |
+    | Texlive       | Complete LaTeX environment for PDF blog generation.       |
 
 3. Free up disk space:
```
**Manually clean up a Markdown table by fixing misaligned rows**


## Manual cleanup

Before moving to the next step, I manually fix structural issues in the translated Markdown:

* Broken tables.
* Incorrect Astro frontmatter.
* Small formatting quirks.

This ensures that the files can be built into the website without errors.

## Proofreading with GPT-4o

DeepL produces decent raw translations, but the style often needs polishing. To automate this, I created another Python script that sends the translated file to **GPT-4o** with a strict editing prompt:

```python
def proofread_with_gpt(content):
 response = client.chat.completions.create(
 model="gpt-4o",
   messages=[
    {
    "role": "system",
    "content": (
    "You are an expert technical writing editor. "
    "The text is about technical writing, DITA, structured authoring. "
    "Fix inconsistencies, unprofessional style, and poor French-to-English translations. "
    "Keep Markdown formatting intact. "
    "Return only the corrected text, without explanations."
    ),
    },
    {"role": "user", "content": content},
   ],
)
 return response.choices[0].message.content.strip()
```

To stay in control, the script processes **one file at a time** and stops. This makes it easier to review and cherry-pick changes.

## Selective review with Git

Instead of accepting every change blindly, I use:

```bash
git add -p
```

This lets me review GPT’s edits chunk by chunk, applying only the improvements that make sense while rejecting unnecessary changes.

```diff
commit 2dcbd2acfdba58d26f626bf3864d1b3969b17421
Author: Olivier Carrère <xxxxxx@xxxxx.xxx>
Date:   Sun Sep 21 07:26:27 2025 +0200
   Proofread Deepl-translated content with GPT-4o
--- a/src/content/docs/en/veille/raspberry-pi-plateforme-documentation.md
+++ b/src/content/docs/en/veille/raspberry-pi-plateforme-documentation.md
@@ -1,22 +1,22 @@
---
title: "The Raspberry Pi 3 as a documentation platform"
description: "With its modest resources, a Raspberry Pi 3 is all you need to create, manage and generate documentation in PDF, HTML or EPUB format."
+proofreading: IA
---
-
-Do you need an outpouring of power to generate professional documentation? With its single gigabyte of RAM and smartphone-like processor, the Raspberry Pi 3 seems to be positioned as a good office workstation from the 2000s... In practice, however, it turns out that a CPU costing around 40 euros is more than enough to create, manage and generate documentation in PDF, HTML or other formats.
+Do you need a lot of power to generate professional documentation? With its single gigabyte of RAM and smartphone-like processor, the Raspberry Pi 3 seems fit for an early 2000s office workstation. In practice, however, a CPU costing around 40 euros is more than enough to create, manage, and generate documentation in PDF, HTML, or other formats.
:::note
-The aims of this post are to:
+This post aims to:
-- Present a <abbr title="Proof of Concept, demonstration of feasibility">POC</abbr> and use minimal resources to create, manage and publish professional documentation. Most operations therefore take place in text mode, under Linux. While the solutions presented here also work in graphical mode under Windows, they may not be available under Windows 10 IoT, intended for the Raspberry Pi 3.
-- Presenting a user scenario that's as simple as possible, sometimes to the detriment of technical elegance.
+- Present a <abbr title="Proof of Concept, demonstration of feasibility">POC</abbr> and use minimal resources to create, manage, and publish professional documentation. Most operations occur in text mode under Linux. While these solutions work in graphical mode under Windows, they may not be available on Windows 10 IoT, intended for the Raspberry Pi 3.
+- Present a user scenario that's as simple as possible, sometimes at the expense of technical elegance.
```
**Simplify wording, fix grammar, and clarify phrasing via IA**

## Building the site and fixing media

Once the text is in good shape, I build the site locally to catch any remaining errors. Common fixes include:

* Adjusting translated image filenames.
* Copying SVG diagrams from **fr/** into a new **en/** folder.
* Translating diagrams manually in **Inkscape** and updating file paths.

## Rinse and repeat

The process is iterative:

1. Run the proofreading script on the next Markdown file.
2. Select changes via **git add -p**.
3. Rebuild and adjust assets.

Rinse and repeat until the full documentation set is translated.

This workflow isn’t a replacement for professional translation, but it’s **“good enough” for legacy content** where perfect nuance is less critical. For high-visibility or customer-facing material, I would still recommend a final round of **human proofreading**.

But with this pipeline, I was able to **translate and modernize a large corpus of technical documentation efficiently**—combining the strengths of DeepL, GPT, and a bit of manual oversight.
