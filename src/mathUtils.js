import * as mjs from 'mathjs';

const MPA_TO_PSI = 145 // 1 MPa = 145 psi
const LBF_TO_NEWTON = 4.448 // 1 lbf = 4.448 N

export function mpa2psi(mpa_val){
    return mjs.round(mpa_val*MPA_TO_PSI)
  }

export function psi2mpa(psi_val){
  return mjs.round(psi_val/MPA_TO_PSI)
}
  
export function lbf2newton(lbf_val){
    return mjs.round(lbf_val*LBF_TO_NEWTON)
  }

export function selectFormat(metadata){
  let Fsu_ksi = metadata.fast_fsu/1000
  let Fsu_MPa = psi2mpa(metadata.fast_fsu)

  let formattedString = metadata.fast_type + " ("
    + metadata.csk_angle + " " + metadata.head_type + ", Fsu: " + Fsu_ksi + " ksi / " + Fsu_MPa +" MPa)"
  return (formattedString)

}
export function calcUltKnockdown(t, Pult, tcsk, d, Fbru, Fsu){
  /*
  Calculates nondimensional joint knockdown based on supplied data
  INPUTS
    t: array of joint thickness values [in]
    P: array of joint (yld or ult) strength data [lbf]
    tcsk: fastener countersunk head height [in]
    d: fastener major diameter [in]
    Fbru: sheet A-basis bearing strength [psi]
    Fsu: fastener ultimate shear strength [psi]

  RETURNS
    tcsk_t: countersink depth ratio tcsk/t
    Kcsk: Non-dimensional strength knockdown P/(joint bearing/shear envelope)
  */
 let Penv = jointStrengthEnvelope(t,d,Fbru,Fsu);

 // calculate csk depth ratio for all sheet thicknesses
 let tcsk_t = mjs.dotDivide(tcsk,t);
 //console.log(tcsk_t)

 // calculate Kcsk for valid data pairs
 let Kcsk = Pult.map((x, ind) => mjs.evaluate("a/b",{a:x, b:Penv[ind]}))

  return {tcsk_t, Kcsk, Penv, d }
}

export function calcUserKnockdown(userFbru, nomKcsk) {
  // @TODO
}

export function jointStrengthEnvelope(t, d, Fbru, Fsu){
  /* Calculates bearing-shear strength envelope
  INPUTS
    t: array of joint thickness values [in]
    d: hole nominal diameter [in]
    Fbru: Joint ultimate bearing strength [psi]
    Fsu: Fastener ultimate shear strength [psi]
  RETURNS
    Penv: (array) Ultimate load corresponding to each sheet thickness [lbf]
  */
 let Pbru = mjs.evaluate("t*d*Fbru",{t:t, d:d, Fbru:Fbru});
 let Psu = mjs.evaluate("F*pi*(d^2)/4",{d:d, F:Fsu,pi:mjs.pi});
 let Penv = Pbru.map((P_i)=>mjs.min(P_i,Psu));
 return Penv
}