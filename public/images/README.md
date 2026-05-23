# Where to put your images

Drop your real photos into these exact locations and keep the file names
(or update the matching path in the React code). Until a real file exists,
the site shows `placeholder.svg` automatically.

```
public/images/
  hero.jpg                       <- big hero background (chef cooking / a plated dish)
  about.jpg                      <- portrait or kitchen shot for the About section

  experiences/
    intimate-dinners.jpg
    family-gatherings.jpg
    special-celebrations.jpg
    wellness-cuisine.jpg

  gallery/                       <- THE GALLERY GRID READS FROM HERE
    gallery-1.jpg
    gallery-2.jpg
    gallery-3.jpg
    gallery-4.jpg
    gallery-5.jpg
    gallery-6.jpg
```

## Gallery
The gallery grid is driven by the `galleryImages` array in
`src/components/Gallery.jsx`. To add, remove, or rename images, edit that array.
You can also add a video by setting `type: "video"` on an entry.

## Recommended sizes (for fast loading)
- hero.jpg ........ 1920x1080 or larger, landscape
- about.jpg ....... ~1000x1200, portrait
- experiences/* ... ~1000x800, landscape
- gallery/* ....... ~1000x1000, square works best in the grid

Use `.jpg` for photos. Compress them (e.g. squoosh.app) to keep the page fast.
