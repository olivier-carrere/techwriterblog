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
**Manually fix Markdown table rows by adding missing trailing pipe characters**

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
$ git add -p
```

Use **git add -p** to review changes **hunk by hunk** and stage only what you want. For each chunk of the diff, Git shows the context and asks if you want to stage it (**y** = yes, **n** = no). You can split hunks into smaller pieces with **s**, edit them manually with **e**, or quit anytime with **q**. This workflow is perfect when a file contains unrelated edits—such as AI-generated suggestions—because it lets you accept improvements selectively while keeping control over your commit history.

```diff
diff --git a/src/content/docs/en/costs/de-la-redaction-a-la-communication-technique.md b/src/content/docs/en/costs/de-la-redaction-a-la-communication-technique.md
index d5b0c9b8..7a5632af 100644
--- a/src/content/docs/en/costs/de-la-redaction-a-la-communication-technique.md
+++ b/src/content/docs/en/costs/de-la-redaction-a-la-communication-technique.md
@@ -1,31 +1,30 @@
 ---
-title: "From copywriting to technical communication"
+title: "From technical writing to technical communication"
 description: "Technical communication is often reduced to technical writing. Technical writing is intended to provide product documentation, and is involved downstream of sales."
+proofreading: IA
 ---
+The goal of **technical communication** is to convert prospects into satisfied customers. The **technical writer** provides the market with the information needed to select, evaluate, and use a high-tech solution. Within the company, they serve as the interface between the R&D and marketing departments. Externally, they facilitate dialogue between the company and its various audiences.
 
-
-The goal of **technical communication** is to turn prospects into satisfied customers. The **technical writer** provides the market with the information it needs to select, evaluate and use a high-tech solution. Within the company, they are the interface between the R&D and marketing departments. Externally, they create dialogue between the company and its various audiences.
-
-Technical communication** is often reduced to technical writing**. Technical writing is intended to provide product documentation, and takes place after the sale. Technical communication takes place upstream of the sales process and accompanies the product throughout its life cycle. Aimed as much at the general public, journalists and prospects as at customers, it goes beyond and encompasses technical writing, intended solely for users.
+**Technical communication** is often equated with **technical writing**, which focuses on product documentation created post-sale. Technical communication, however, occurs before the sales process and accompanies the product throughout its life cycle. Targeting the general public, journalists, and prospects as well as customers, it goes beyond technical writing, which is intended solely for users.
 
 ![Marketing and technical writing tools](/assets/marketing-technique.svg)
-**Marketing and technical writing support**
+**Support for Marketing and Technical Writing**
 
-The aim of technical communication is to demonstrate a product's suitability for its target audience. To do this, it uses a variety of media, more or less adapted to the level of expertise of its audience and its status in relation to the company (general public, journalists, prospects, customers...). The **technical writer** must adapt his message to each audience. Using all communication resources (copywriting, illustrations, films, animations, etc.), they constantly take into account the marketing dimension. To increase sales, every communication medium must be a marketing tool.
+Technical communication aims to demonstrate a product's suitability for its target audience. It uses a variety of media, tailored to the level of expertise and status of its audience (general public, journalists, prospects, customers, etc.). The **technical writer** must adapt their message to each audience. By leveraging all communication resources (writing, illustrations, films, animations, etc.), they consistently incorporate a marketing dimension. To boost sales, every communication medium must also be a marketing tool.
 
-But can you be both logical and creative? This is necessary in the fields of musical composition, architecture and computer development. It's also the case for a **technical copywriter**.
+But can someone be both logical and creative? This duality is essential in musical composition, architecture, and computer development. It is also true for a **technical writer**.
 
 This requires:
 
-- a study of the match between the public's needs and the company's resources,
-- good creative and writing skills,
-- rigorous project management,
-- an industrial process for producing and promoting content.
+- studying the alignment between the public's needs and the company's resources,
+- possessing strong creative and writing skills,
+- executing rigorous project management,
+- implementing an industrial process for producing and promoting content.
 
-This blog presents a few examples of technical communication media, their marketing value, their suitability for the target audience and how to get the most out of them.
+This blog presents examples of technical communication media, their marketing value, their relevance to the target audience, and how to maximize their potential.
 
-Adding value to content means:
+Adding value to content involves:
 
-- producing quality content adapted to your target audience,
+- producing quality content that aligns with your target audience,
 - preserving existing content in its various versions,
 - reusing or recycling existing content.
(1/1) Indexer cette section [y,n,q,a,d,s,e,p,?] ? s
Découpée en 11 sections.
@@ -1,3 +1,3 @@
 ---
-title: "From copywriting to technical communication"
+title: "From technical writing to technical communication"
 description: "Technical communication is often reduced to technical writing. Technical writing is intended to provide product documentation, and is involved downstream of sales."
(1/11) Indexer cette section [y,n,q,a,d,j,J,g,/,e,p,?] ? 
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

Once you’ve staged the hunks you want, save them in a commit with:

```bash
$ git commit -m "commit message"
```

Finally, you can discard all the rejected changes from your working tree with:

```bash
$ git reset --hard
```

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
