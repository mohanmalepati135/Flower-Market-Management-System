// // WhatsApp Link Only - No API integration
// const messageService = {
//   async sendMessage(user, messageData, lang) {
//     console.log(` MESSAGE to ${user.fullName} (${user.preferredChannel}):`, messageData);
    
//     const phone = user.phone.replace(/\D/g, '');
//     const { type, tx, farmer, buyer } = messageData;
//     let msg = '';
    
//     if (lang === 'te') {
//       if (type === 'supply') {
//         msg = ` స్మార్ట్ ఫ్లవర్ మార్కెట్\n రైతు: ${farmer.fullName}\n ${tx.flowerName}\n ${tx.weightKg}కిలో\n ధర: ₹${tx.pricePerKg}/కిలో`;
//       } else if (type === 'purchase_confirmation') {
//         msg = ` కొనుగోలు దృవీకరణ\nహలో ${buyer.fullName},\nమీరు కొనుగోలు చేసారు:\n ${tx.flowerName}\n ${tx.weightKg}కిలో\n👨‍🌾 రైతు: ${farmer.fullName} \n ధర: ₹${tx.pricePerKg}/కిలో`;
//       }
//     } else if (lang === 'hi') {
//       if (type === 'supply') {
//         msg = ` स्मार्ट फ्लावर मार्केट\n किसान: ${farmer.fullName}\n ${tx.flowerName}\n ${tx.weightKg}किलो`;
//       } else if (type === 'purchase_confirmation') {
//         msg = ` खरीद पुष्टिकरण\nनमस्ते ${buyer.fullName},\n ${tx.flowerName}\n ${tx.weightKg}किलो`;
//       }
//     } else {
//       if (type === 'supply') {
//         msg = ` SMART FLOWER MARKET\n Farmer: ${farmer.fullName}\n ${tx.flowerName}\n ${tx.weightKg}kg \n Price: ₹${tx.pricePerKg}/kg`;
//       } else if (type === 'purchase_confirmation') {
//         msg = ` PURCHASE CONFIRMATION\nHello ${buyer.fullName},\n ${tx.flowerName}\n ${tx.weightKg}kg\n From: ${farmer.fullName}\n `;
//       }
//     }
    
//     if (user.preferredChannel === 'WHATSAPP') {
//       const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
//       window.open(whatsappUrl, '_blank');
//     }
    
//     return { success: true, method: user.preferredChannel };
//   }
// };

// export default messageService;

// WhatsApp Link Only - No API integration - TELUGU ONLY
const messageService = {
  async sendMessage(user, messageData, lang) {
    console.log(`📱 MESSAGE to ${user.fullName} (${user.preferredChannel}):`, messageData);
    
    const phone = user.phone.replace(/\D/g, '');
    const { type, tx, farmer, buyer, seller } = messageData;
    let msg = '';
    
    // Helper to format price status in Telugu
    const getPriceInfo = () => {
      if (tx.status === 'PRICE_APPLIED' && tx.pricePerKg > 0) {
        return {
          price: `₹${tx.pricePerKg}/కిలో`,
          total: `₹${(tx.weightKg * tx.pricePerKg).toFixed(2)}`,
          gross: `₹${(tx.grossAmount || 0).toFixed(2)}`,
          commission: tx.commissionAmount > 0 ? `₹${tx.commissionAmount.toFixed(2)}` : null,
          net: `₹${(tx.netAmount || 0).toFixed(2)}`,
          isFixed: true
        };
      }
      return {
        price: 'ఇంకా నిర్ణయించబడలేదు',
        total: 'త్వరలో తెలియజేస్తాము',
        isFixed: false
      };
    };

    const priceInfo = getPriceInfo();
    const isResale = tx.transactionType === 'BUYER_TO_BUYER';
    
    if (type === 'supply') {
      // Message to farmer about supply
      msg = ` స్మార్ట్ ఫ్లవర్ మార్కెట్\n\n`;
      msg += ` రైతు: ${farmer.fullName}\n`;
      msg += ` పువ్వు: ${tx.flowerName}\n`;
      msg += ` బరువు: ${tx.weightKg} కిలో\n`;
      
      if (isResale && seller) {
        msg += ` రీసేల్: ${seller.fullName} ద్వారా\n`;
        msg += ` కొనుగోలుదారు: ${buyer.fullName}\n`;
      } else {
        msg += ` కొనుగోలుదారు: ${buyer.fullName}\n`;
      }
      
      msg += `\n ధర: ${priceInfo.price}\n`;
      
      if (priceInfo.isFixed) {
        msg += ` మొత్తం మొత్తం: ${priceInfo.gross}\n`;
        if (priceInfo.commission && isResale) {
          msg += ` కమిషన్ (5%): -${priceInfo.commission}\n`;
          msg += ` నెట్ చెల్లింపు: ${priceInfo.net}\n`;
        }
      } else {
        msg += ` ధర త్వరలో నిర్ణయించబడుతుంది\n`;
      }
      
      msg += `\n తేదీ: ${new Date(tx.createdAt).toLocaleDateString('te-IN')}\n`;
      
      
    } else if (type === 'purchase_confirmation') {
      // Message to buyer about purchase
      msg = ` కొనుగోలు దృవీకరణ\n\n`;
      msg += `నమస్కారం ${buyer.fullName} గారు,\n\n`;
      msg += `మీ కొనుగోలు వివరాలు:\n`;
      msg += ` పువ్వు: ${tx.flowerName}\n`;
      msg += ` బరువు: ${tx.weightKg} కిలో\n`;
      msg += ` రైతు: ${farmer.fullName}\n`;
      
      if (isResale && seller) {
        msg += `మధ్యవర్తి: ${seller.fullName}\n`;
      }
      
      msg += `\n ధర: ${priceInfo.price}\n`;
      
      if (priceInfo.isFixed) {
        msg += ` మొత్తం బిల్: ${priceInfo.gross}\n`;
        if (priceInfo.commission && isResale) {
          msg += ` కమిషన్: -${priceInfo.commission}\n`;
          msg += ` చెల్లించాల్సిన మొత్తం: ${priceInfo.net}\n`;
        } else {
          msg += ` చెల్లించాల్సిన మొత్తం: ${priceInfo.net}\n`;
        }
        msg += `\n దయచేసి చెల్లింపు చేయండి`;
      } else {
        msg += ` ధర నిర్ణయించగానే మీకు తెలియజేస్తాము\n`;
        msg += ` మీ WhatsApp కు నోటిఫికేషన్ పంపబడుతుంది`;
      }
      
      msg += `\n\n తేదీ: ${new Date(tx.createdAt).toLocaleDateString('te-IN')}\n`;
      
      msg += `ధన్యవాదాలు! `;
      
    } else if (type === 'resale_confirmation') {
      // Message to seller about resale
      msg = ` రీసేల్ నిర్ధారణ\n\n`;
      msg += `నమస్కారం ${seller.fullName} గారు,\n\n`;
      msg += `మీ రీసేల్ వివరాలు:\n`;
      msg += ` పువ్వు: ${tx.flowerName}\n`;
      msg += ` బరువు: ${tx.weightKg} కిలో\n`;
      msg += ` రైతు: ${farmer.fullName}\n`;
      msg += ` కొనుగోలుదారు: ${buyer.fullName}\n`;
      
      msg += `\n ధర: ${priceInfo.price}\n`;
      
      if (priceInfo.isFixed) {
        msg += ` మొత్తం: ${priceInfo.gross}\n`;
        msg += ` కమిషన్ (5%): ${priceInfo.commission}\n`;
        msg += ` మీకు లభించే మొత్తం: ${priceInfo.commission}\n`;
        msg += `\n గమనిక: కమిషన్ రైతు చెల్లింపు నుండి తగ్గించబడుతుంది`;
      } else {
        msg += ` ధర త్వరలో నిర్ణయించబడుతుంది\n`;
      }
      
      msg += `\n\n తేదీ: ${new Date(tx.createdAt).toLocaleDateString('te-IN')}\n`;
      
      
    } else if (type === 'price_fixed_notification') {
      // Notification when price is fixed
      msg = `ధర నిర్ణయం\n\n`;
      msg += `నమస్కారం ${user.fullName} గారు,\n\n`;
      msg += `మీ లావాదేవీ కోసం ధర నిర్ణయించబడింది:\n\n`;
      msg += ` పువ్వు: ${tx.flowerName}\n`;
      msg += ` బరువు: ${tx.weightKg} కిలో\n`;
      msg += ` ధర: ₹${tx.pricePerKg}/కిలో\n`;
      msg += ` మొత్తం బిల్: ₹${(tx.grossAmount || 0).toFixed(2)}\n`;
      
      if (tx.commissionAmount > 0) {
        msg += ` కమిషన్: -₹${tx.commissionAmount.toFixed(2)}\n`;
        msg += ` చెల్లించాల్సిన మొత్తం: ₹${(tx.netAmount || 0).toFixed(2)}\n`;
      } else {
        msg += ` చెల్లించాల్సిన మొత్తం: ₹${(tx.netAmount || 0).toFixed(2)}\n`;
      }
      
      msg += `\nదయచేసి చెల్లింపు చేయండి. ధన్యవాదాలు! 🙏`;
    }
    
    if (user.preferredChannel === 'WHATSAPP') {
      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
      window.open(whatsappUrl, '_blank');
    }
    
    return { success: true, method: user.preferredChannel, message: msg };
  }
};

export default messageService;