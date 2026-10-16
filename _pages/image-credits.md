---
layout: page
title: Image Credits
permalink: /image-credits/
nav: false
description: Sources, authors, and licences of the figures used on this website.
---

Figures marked **schematic** are illustrations computed from minimal textbook models with
[`bin/research_figures.py`](https://github.com/spinlessFermion1729/spinlessFermion1729.github.io/blob/main/bin/research_figures.py).
They are not research data. All other images are reproduced from Wikimedia Commons under the
licences listed below.

<div class="sx-credits">
{% for fig in site.data.image_credits %}
  <article class="sx-credit-item" id="{{ fig.id }}">
    <img src="{{ fig.file | relative_url }}" alt="{{ fig.alt | strip }}" loading="lazy" decoding="async">
    <div>
      <h2>{{ fig.title }}{% if fig.kind == 'schematic' %} <span class="sx-chip sx-chip-inline">Schematic</span>{% endif %}</h2>
      <p>{{ fig.caption | strip }}</p>
      <dl>
        <dt>Author</dt><dd>{{ fig.author }}</dd>
        <dt>Source</dt><dd>{% if fig.source contains '://' %}<a href="{{ fig.source }}">{{ fig.source }}</a>{% else %}{{ fig.source }}{% endif %}</dd>
        {% if fig.license %}<dt>Licence</dt><dd><a href="{{ fig.license_url }}">{{ fig.license }}</a></dd>{% endif %}
        <dt>Changes</dt><dd>{{ fig.modifications }}</dd>
      </dl>
    </div>
  </article>
{% endfor %}
</div>
