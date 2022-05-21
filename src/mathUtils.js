const MPA_TO_PSI = 145 // 1 MPa = 145 psi
const LBF_TO_NEWTON = 4.448 // 1 lbf = 4.448 N

export function mpa2psi(mpa_val){
    return mpa_val*MPA_TO_PSI
  }
  
export function lbf2newton(lbf_val){
    return lbf_val*LBF_TO_NEWTON
  }