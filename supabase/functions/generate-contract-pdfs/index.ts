import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Generating sample contract PDFs...')

    // Fetch all lease agreements
    const { data: leases, error: leasesError } = await supabase
      .from('lease_agreements')
      .select(`
        *,
        tenants (
          name,
          floor,
          business_type
        )
      `)

    if (leasesError) {
      throw new Error(`Failed to fetch leases: ${leasesError.message}`)
    }

    const results = []

    for (const lease of leases) {
      // Generate sample PDF content
      const pdfContent = generateSamplePDF(lease)
      const fileName = `${lease.tenant_id}_lease_agreement.pdf`
      const filePath = `contracts/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('contracts')
        .upload(filePath, pdfContent, {
          contentType: 'application/pdf',
          upsert: true
        })

      if (uploadError) {
        console.error(`Failed to upload ${fileName}:`, uploadError)
        results.push({ lease_id: lease.id, success: false, error: uploadError.message })
      } else {
        console.log(`Successfully uploaded ${fileName}`)
        results.push({ lease_id: lease.id, success: true, file_path: filePath })
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Contract PDFs generation completed',
        results 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error generating contract PDFs:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

function generateSamplePDF(lease: any): Uint8Array {
  // Simple PDF content generator (basic text-based PDF)
  const content = `
LEASE AGREEMENT

Tenant: ${lease.tenants?.name || 'N/A'}
Floor: ${lease.tenants?.floor || 'N/A'}
Business Type: ${lease.tenants?.business_type || 'N/A'}

Lease Start Date: ${lease.lease_start}
Lease End Date: ${lease.lease_end}
Monthly Rent: $${lease.monthly_rent}

Terms Summary:
${lease.terms_summary || 'Standard lease terms apply.'}

This is a sample contract document generated for demonstration purposes.

Signatures:
Landlord: ___________________ Date: ___________
Tenant: _____________________ Date: ___________
`

  // Convert to basic PDF format (simplified)
  const pdfHeader = "%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
  const pdfBody = `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n4 0 obj\n<< /Length ${content.length + 50} >>\nstream\nBT\n/F1 12 Tf\n50 750 Td\n${content.replace(/\n/g, '\\n')}\nET\nendstream\nendobj\n5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`
  const pdfFooter = "xref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000245 00000 n \n0000000345 00000 n \ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n445\n%%EOF"
  
  const pdfString = pdfHeader + pdfBody + pdfFooter
  return new TextEncoder().encode(pdfString)
}