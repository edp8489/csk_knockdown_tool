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
export function calcUltKnockdown(t, P, tcsk, d, Fbru, Fsu){
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
    Kcsk: Non-dimensional strength knockdown P/(joint bearing-shear envelope)
  */
 let Penv = jointStrengthEnvelope(t,d,Fbru,Fsu);

 // calculate csk depth ratio for all sheet thicknesses
 let tcsk_t = mjs.dotDivide(tcsk,t);
 //console.log(tcsk_t)

 // calculate Kcsk for valid data pairs
 let Kcsk = P.map((x, ind) => mjs.evaluate("a/b",{a:x, b:Penv[ind]}))

  return {tcsk_t, Kcsk, d }
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

export function genPlotPenv(t, d, Fbru, Fsu){
  /*
  Calculates bearing-shear strength envelope plot for given thickness range,
  fastener diameter, and material strengths
  INPUTS
    tmin: minimum sheet thickness to begin envelope [in]
    tmax: maximum sheet thickness to end envelope [in]
    d:    fastener diameter [in]
    Fbru: Material ultimate bearing strength [psi]
    Fsu:  fastener ultimate shear strength [psi]
  
  RETURNS
    {
      d: fastener diameter
      tenv: array of thickness values for envelope plot [in]
      Penv: array of ultimate strength values for envelope plot [lbf]
    }
  */

  let tmin = mjs.min(t)
  let tmax = mjs.max(t)
  let Psu = mjs.evaluate("F*pi*(d^2)/4",{d:d, F:Fsu,pi:mjs.pi});
  let teq = mjs.evaluate("Ps/(Fbr*d)",{Ps:Psu, d:d, Fbr:Fbru});

  // calculate thickness where sheet Pbru = fastener Psu
  let tenv = [tmin, teq, tmax];
  let Penv = [mjs.evaluate("Fbr*t*d",{Fbr:Fbru, t:tmin, d:d}),
  Psu, Psu]

  let plotPenv = {d, tenv, Penv}
  return plotPenv
}

export function calcGenericKnd(tcsk_t){
  /*
  Calculates a generic knockdown curve based on available data
  @TODO
  */
}