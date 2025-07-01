module.exports = async (page, scenario, vp) => {
  console.log('SCENARIO > ' + scenario.label);
  await require('./clickAndHoverHelper')(page, scenario);

  // Force load all lazy-loaded images
  await forceLazyLoadImages(page);

  // add more ready handlers here...
};

/**
 * Forces all lazy-loaded images on the page to load
 * @param {Object} page - Puppeteer page object
 * @returns {Promise<void>}
 */
async function forceLazyLoadImages(page) {
  console.log('Forcing lazy-loaded images to load...');
  
  // Wait a bit to ensure the page has had time to initialize lazy loading
  await page.waitForTimeout(1000);
  
  // Find and load all images with common lazy-loading attributes
  await page.evaluate(() => {
    const lazyImages = Array.from(document.querySelectorAll('img[loading="lazy"], img[data-src], img[data-srcset], img.lazy, img.lazyload, img[data-lazy-src]'));
    
    console.log(`Found ${lazyImages.length} potentially lazy-loaded images`);
    
    lazyImages.forEach(img => {
      // Handle data-src attribute
      if (img.getAttribute('data-src')) {
        img.src = img.getAttribute('data-src');
      }
      
      // Handle data-srcset attribute
      if (img.getAttribute('data-srcset')) {
        img.srcset = img.getAttribute('data-srcset');
      }
      
      // Handle data-lazy-src attribute
      if (img.getAttribute('data-lazy-src')) {
        img.src = img.getAttribute('data-lazy-src');
      }
      
      // Remove loading="lazy" attribute
      if (img.getAttribute('loading') === 'lazy') {
        img.removeAttribute('loading');
      }
      
      // Force the browser to load the image
      img.loading = 'eager';
      
      // Make the image visible if it was hidden
      img.style.visibility = 'visible';
      img.style.display = 'inline';
      img.style.opacity = '1';
    });
    
    // Also handle background images in divs that might be lazy-loaded
    const lazyBackgrounds = Array.from(document.querySelectorAll('[data-bg], [data-background], [data-background-src]'));
    
    console.log(`Found ${lazyBackgrounds.length} potentially lazy-loaded background images`);
    
    lazyBackgrounds.forEach(el => {
      if (el.getAttribute('data-bg')) {
        el.style.backgroundImage = `url(${el.getAttribute('data-bg')})`;
      }
      if (el.getAttribute('data-background')) {
        el.style.backgroundImage = `url(${el.getAttribute('data-background')})`;
      }
      if (el.getAttribute('data-background-src')) {
        el.style.backgroundImage = `url(${el.getAttribute('data-background-src')})`;
      }
    });
    
    // Trigger scroll events to activate any scroll-based lazy loaders
    window.scrollTo(0, 100);
    window.scrollTo(0, 0);
  });
  
  // Wait for all images to load
  await page.evaluate(async () => {
    const imgElements = Array.from(document.getElementsByTagName('img'));
    
    // Create an array of promises for each image load
    const imgPromises = imgElements.map(img => {
      // If image is already loaded or has no src, resolve immediately
      if (img.complete || !img.src) {
        return Promise.resolve();
      }
      
      // Otherwise wait for the image to load or error
      return new Promise(resolve => {
        img.addEventListener('load', resolve);
        img.addEventListener('error', resolve); // Resolve on error too to avoid hanging
      });
    });
    
    // Wait for all image promises to resolve
    await Promise.all(imgPromises);
    console.log(`Waited for ${imgElements.length} images to load`);
  });
  
  // Final wait to ensure everything is rendered
  await page.waitForTimeout(1000);
  console.log('All lazy-loaded images should now be loaded');
}
