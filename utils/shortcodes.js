module.exports = {
  icon: function (name) {
    return `<svg class="icon icon--${name}" role="img" aria-hidden="true" width="24" height="24">
              <use xlink:href="#icon-${name}"></use>
            </svg>`;
  },

  // adapted from https://www.npmjs.com/package/eleventy-plugin-respimg
  // 
  // required:
  //  - string @url: path to the original cloudinary file, already in the media library
  //  - string @alt: alt text for the image
  //  - int @w: intrinsic width of original image, in px
  //  - int @h: intrinsic height of original image, in px
  //  - array @sizes: integers representing breakpoints
  //  - bool @yAxis: breakpoints are for width (default) or height
  //  - string @classNames: concatenated list of class names to append to the <img>
  respimg: (url, width, height, sizes = [], yAxis = false, alt = '', classNames = '') => {
    // for inserting cloudinary transforms into the url
    const versionPattern = /(\/v\d+\/)/;

    // validate
    if (!url) { return ''; }
    if (!width || !height) {
      return `<img 
                src="${url.replace(versionPattern, `/f_auto$1`)}" 
                alt="${alt}" 
                class="${classNames}" 
              />`;
    }

    // compose sizes
    const widthCoefficient = yAxis ? (width / height) : 1;
    let _sizes;
    if (!sizes.length) {
      _sizes = '100vw';
    } else {
      const axis = yAxis ? 'height' : 'width';
      let s = sizes.map(size => {
        return `(max-${axis}: ${size}px) ${Math.round(size * widthCoefficient)}px`;
      });
      s.push(`${width}px`);
      _sizes = s.join(', ');
    }

    // compose srcset
    let _srcset = sizes.map(size => {
      const targetDimension = yAxis ? 'h' : 'w';
      const transform = `/c_fill,${targetDimension}_${size},f_auto`;
      return `${url.replace(versionPattern, `${transform}$1`)} ${Math.round(size * widthCoefficient)}w`;
    });
    _srcset.push(url.replace(versionPattern, `/f_auto$1`));

    // return tag
    return `<img 
              src="${url.replace(versionPattern, `/f_auto$1`)}" 
              srcset="${_srcset.join(', ')}" 
              sizes="${_sizes}" 
              alt="${alt}" 
              class="${classNames}" 
              width="${width}" 
              height="${height}" 
            />`;
  }
}
