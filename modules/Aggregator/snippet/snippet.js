// modules/Aggregator/snippet/snippet.js

(function() {
    console.log('Aggregator snippet loaded.');
  
    // 1. Detect affiliateId/discountId from URL
    const urlParams = new URLSearchParams(window.location.search);
    const affiliateId = urlParams.get('affiliateId');
    const discountId = urlParams.get('discountId');
  
    // 2. (Optional) Adjust displayed price or show discount info
    // This part depends on the retailer's checkout. 
    // For a minimal example, we do nothing until purchase completes.
  
    // 3. Example: Suppose there's a "Complete Purchase" button we can hook
    // Listen for the "click" or "submit" event
    const purchaseBtn = document.getElementById('purchaseBtn');
    if (purchaseBtn) {
      purchaseBtn.addEventListener('click', async function() {
        // Let's pretend the final price is from a page element
        const finalPriceElement = document.getElementById('finalPrice');
        const finalPrice = finalPriceElement ? Number(finalPriceElement.innerText) : 100;
  
        // Post to aggregator
        try {
          const response = await fetch('https://yourdomain.com/aggregator/track-purchase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              retailerId: 10,        // Some retailer ID
              userId: 123,          // If you know the user, or pass null for guests
              affiliateId,          // from URL
              discountId,           // from URL
              finalPrice,
              currency: 'USD'
            })
          });
          const data = await response.json();
          console.log('Aggregator response:', data);
          // If success, maybe redirect to a success page
          // window.location.href = '/thank-you';
        } catch (err) {
          console.error('Error sending purchase to aggregator:', err);
        }
      });
    }
  })();
  