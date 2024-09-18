---
title: Boolean algebra
author: Johannes Korbmacher
weight: 4
params: 
  id: exc-boo
  math: true
---

$\LaTeX$: The solutions for exercises marked with this symbol need to be typed
up using the latex typesetting system. If the exercise is homework, you need to
digitally submit the solution as a PDF. Ask your TA to find out how.

If you don't know what $\LaTeX$ is and how it works, you can learn it in 30
minutes by following this
[link](https://www.overleaf.com/learn/latex/Learn_LaTeX_in_30_minutes).

For convenience, there are copy-paste-able $\LaTeX$-snippets included at the end
of each question (click to expand).

# Recursion {.latex}

For this exercise, use a propositional language with the following variables:

+ $MARS$, which stands for "Mars is red",
+ $VENUS$, which stands for "Venus is green",
+ $PLUTO$, which stands for "Pluto is black".

Take a model where:

+ $\nu(MARS)=1$,
+ $\nu(VENUS)=1$,
+ $\nu(PLUTO)=0$. 

Show the recursive calculation in this model for the truth-value of each formula below.

1. $\nu(\neg PLUTO)=$ ?
2. $\nu(MARS\land VENUS)=$ ?
3. $\nu(PLUTO\lor\neg MARS)=$ ?
4. $\nu(MARS\land\neg PLUTO)=$ ?
5. $\nu(\neg(VENUS\land\neg\neg (PLUTO\lor MARS)))=$ ?

{{< latex >}}
\begin{enumerate}
  \item  $\nu(\neg PLUTO)=$ 
  \item  $\nu(MARS\land VENUS)=$ 
  \item  $\nu(PLUTO\lor\neg MARS)=$ 
  \item  $\nu(MARS\land\neg PLUTO)=$ 
  \item  $\nu(\neg(VENUS\land\neg\neg (PLUTO\lor MARS)))=$ 
\end{enumerate}
{{< /latex >}}

# Boolean laws {.latex}

Use the Boolean laws in section 4.6 to explain why these equations are correct.

## a) 

$x\times (x+y) =  x+(x\times y)$

## b) 

$y\times z = y\times (z\times y)$

## c) 

$(x + (y\times z))+x=(x+y)\times(x+z)$

{{< latex >}}

% For reference: the laws

\begin{tabular}{ c c }
  Conjunction laws          &                                          \\[2ex]
  
  Idempotence of $\times$   & $x\times x=x$                            \\
  Commutativity of $\times$ & $x\times y=y\times x$                    \\
  Associativity of $\times$ & $x\times(y\times z)=(x\times y)\times z$ \\
  Identity for $\times$     & $x\times 1=x$                            \\
  Annihilation for $\times$ & $x\times 0=0$                            \\[2ex]
  
  Disjunction laws          &                                          \\[2ex]
  
  Idempotence of $+$        & $x+x=x$                                  \\
  Commutativity of $+$      & $x+y=y+x$                                \\
  Associativity of $+$      & $x+(y+z)=(x+y)+z$                        \\
  Identity for $+$          & $x+0=x$                                  \\
  Annihilation for $+$      & $x+ 1=1$                                 \\[2ex]
  
  Interaction laws          &                                          \\[2ex]
  
  Distributivity $\times$/$+$ & $x\times(y+z)=(x\times y)+(x\times z)$ \\
  Distributivity $+$/$\times$ & $x+(y\times z)=(x+y)\times(x+ z)$      \\
  Absorption 1                & $x+(x\times y)=x$                      \\
  Absorption 2                & $x\times(x+ y)=x$                      \\[2ex]
  
  Negation laws               &                                        \\[2ex]
  
  Complementation 1           & $x\times -x=0$                         \\
  Complementation 2           & $x+ -x=1$                              \\
  Involution                  & $\-\-x=x$                              \\
  De Morgan 1                 & $-(x+y)=-x\times -y$                   \\
  De Morgan 2                 & $-(x\times y)=-x+-y$                   \\
\end{tabular}

% An item for each identity

\begin{itemize}
  \item  $x\times (x+y) =  x+(x\times y)$
  \item  $y\times z = y\times (z\times y)$
  \item  $(x+(y\times z))+x = (x+y)\times(x+z)$
\end{itemize}

{{< /latex >}}

# Validity {.latex}

a) Use the definition of a Boolean model to show that $[A\lor A]=[A]$ for any formula $A$. 

b) Use the previous fact to explain why $A\lor A\vDash A$ and $A\vDash A\lor A$

{{< latex >}}
\begin{itemize}
  \item Use the definition of a Boolean model to show that $[A\lor A]=[A]$ for any formula $A$. 
  \item Use the previous fact to explain why $A\lor A\vDash A$ and $A\vDash A\lor A$
\end{itemize}
{{< /latex >}}
