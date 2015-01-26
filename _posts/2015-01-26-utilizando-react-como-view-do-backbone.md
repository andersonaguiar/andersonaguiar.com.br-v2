---
layout: post
title: Utilizando React como view do Backbone
description: "Esse post mostra a possibilidade de substituir a view do Backbone pelo React"
modified: 2014-08-26
tags: [backbone, reactjs, javascript]
image:
  feature: backbone+react.jpg
comments: true
share: true
---

Meu primeiro post do ano irá mostrar como juntar duas tecnologias sensacionais que por consequência "bombaram" 
no ano de 2014. Será um post direto ao ponto(é recomendado saber o básico de ambos, pois não entrarei em detalhes), 
o Backbone traz consigo a camada de view, e a implementa de maneira funcional. O objetivo do post é mostrar a possibilidade de 
substituir essa view pelo React. Focarei na parte prática, mostrarei um projeto exemplo, que mostra como trabalhar com ambos 
e integrá-los em sua aplicação.

Então vamos lá, para contextualizar uma breve introdução sobre as duas tecnologias:

##Backbone

> Backbone.js gives structure to web applications by providing models with key-value binding and custom events, collections with 
a rich API of enumerable functions, views with declarative event handling, and connects it all to your existing API over a 
RESTful JSON interface. <br>
Fonte: [http://backbonejs.org/](http://backbonejs.org/)

Como você já deva saber, basicamente, Backbone é uma lib que traz o Javascript de forma bem definida(Models, Views, 
Collections, Routers, Events...), te dando formas bem declarativas para criar uma aplicação padronizada e totalmente conectada, 
de quebra, ainda serve tudo isso em uma API RESTFul.

##React

> A Javascript library for building user interfaces <br>
Fonte: [http://facebook.github.io/react/](http://facebook.github.io/react/)

Como a própria descrição já diz, **UI**. Ou seja, pensou em React, logo remeta a camada de visualização, ponto. 
Por ser responsável "apenas" pela parte da View, o React é extremamente espetacular no contexto em que ele age, 
digo isso pois ele trata:

###Virtual DOM + Diff

A VDOM(Virtual DOM) que pode ser estudada a fundo em [virtual-dom](https://github.com/Matt-Esch/virtual-dom), dentro do React 
é trabalhada da seguinte forma:

A partir da criação da cadeia de componentes do React é inicializado a VDOM, tendo isso, o React mantém duas VDOMs, a VDOM antiga e a 
nova VDOM. O diff acontece quando é modificado algum state mapeado dentro da cadeia de componentes, a VDOM antiga será comparada 
com a que houve modificação de estado(a nova VDOM), será verificado onde ocorreu a diferença, e inserido na árvore DOM de fato.

###Componentização

Tudo no React é trabalhado através de componentes, isso é muito bom, pois temos reutilização dos mesmos. Similar ao conceito 
de Web Components.

###Reativo

Age em decorrência de modificações de estados de seus componentes. Alterou estado, o render é invocado.


##Porque eu devo utilizar React como view do Backbone se o mesmo já possui sua própria camada de View?

Perfeito. Essa é a pergunta chave para saber se é viável ou não integrar React à sua aplicação Backbone. 
Para responder a essa pergunta você deve se fazer outras duas perguntas: 

####"Minha aplicação precisará manipular a DOM com muita frequência?"

####"Eu quero componentizar meus elementos sem ter que ficar criando templates pra tudo?"

![Smithsonian Image]({{ site.url }}/images/react+backbone/gosteinaogostei.gif)

Se as duas respostas forem não, então você só deve continuar a ler esse post para fins de conhecimento, 
pois a View do Backbone já atende muito bem sua necessidade, seja ela feita com o default [Underscore](http://underscorejs.org/), ou qualquer outro template. <br>

Mas se a resposta for sim... meu amigo... React "vai cair que é uma luva". Com seu render "inteligente" ele irá sempre fazer o diff do que 
foi modificado antes de tocar na DOM, ou seja, se você está mudando o texto de um span frequentemente, ele NÃO irá recriar todo o elemento na DOM, 
irá apenas criar uma nova VDOM e ver se tem diferença da VDOM antiga, nesse caso foi apenas o conteúdo interno da tag, então o render irá agir apenas nele.

**Quais os ganhos?** *Performance e componentização.*

##Projeto exemplo

Criei um repositório de exemplo no Github, onde o mesmo foi clonado a partir do 
Car List do [Sérgio Siqueira](https://github.com/sergiors/car-list). Modifiquei para o cenário 
de pesquisa básica dos veículos, para que possa ser pesquisado os veículos pela placa e pelo modelo. Os eventos acontecem 
pelo onKeyUp nos inputs de pesquisa. Vamos partir para a parte explicativa...

**Para iniciar, podemos clonar o projeto**

{% highlight javascript %}
git clone https://github.com/andersonaguiar/backbone-react-example.git
{% endhighlight %}

**Instalar os vendors definidos no bower.json**

{% highlight javascript %}
bower install
{% endhighlight %}

It's done.

##Explanação do código

Irei pontuar onde o React estará agindo e de que forma(todos os títulos abaixo serão links para o code no Github).

Para aplicar o React, a primeira coisa a se fazer em um projeto com Backbone é apagar o diretório de views, pois 
quem fará esse papel será o React. 

###[app.js](https://github.com/andersonaguiar/backbone-react-example/blob/master/app/assets/js/app.js)

Esté é o nosso arquivo de inicialização, é nele que está sendo definido o Router e os renders dos componentes do React. 

###[router.js](https://github.com/andersonaguiar/backbone-react-example/blob/master/app/assets/js/router.js)

Aqui é puro Backbone, está sendo definido apenas as rotas que a aplicação vier a ter, no nosso exemplo não existe 
nenhuma rota, apenas o initialize para trazer nossa lista de carros assim que a página for carregada.

###E como a aplicação saberá quando deverá renderizar?

No nosso projeto a delegação, o disparo e a observação de eventos, acontecerá em dois arquivos: filter e cars.

####[filter.js](https://github.com/andersonaguiar/backbone-react-example/blob/master/app/assets/js/components/filter.js)

Esse será o nosso arquivo que conterá o componente do topo, o formulário de filtro.

**Delegação dos eventos**

Os eventos estão atribuídos em dois lugares: no [Formulário(que pelo efeito de bubbling atingirá os inputs)](https://github.com/andersonaguiar/backbone-react-example/blob/master/app/assets/js/components/filter.js#L45) e no 
[Botão Filtrar](https://github.com/andersonaguiar/backbone-react-example/blob/master/app/assets/js/components/filter.js#L55).

**Disparo de eventos**

Sempre que a ação de filtrar for acionada, a mesma chamará o método *_filter*, que por sua vez irá disparar ao Backbone o evento 
customizado [filter:cars](https://github.com/andersonaguiar/backbone-react-example/blob/master/app/assets/js/components/filter.js#L38).

####[cars.js](https://github.com/andersonaguiar/backbone-react-example/blob/master/app/assets/js/components/cars.js)

Esse será o arquivo que terá o componente cars(como lista) e o car(como elemento individual).

**Observação de eventos**

E para finalizar o ciclo, a observação de eventos ocorrerá no componente [Cars](https://github.com/andersonaguiar/backbone-react-example/blob/master/app/assets/js/components/cars.js#L48-L51) 
assim que o mesmo já estiver "montado", sempre que o evento customizado de filtro for disparado, será modificado o state, pela atualização 
da collection de cars de acordo com os filtros passados através do form.

**Palavras finais**

Nesse exemplo a listagem de carros ficou reativa a mudança de estado de filter. Conseguimos combinar o poder das duas tecnologias. 
Criamos nossos componentes, não tocamos na DOM sem necessidade, e aproveitamos o cartel de soluções do Backbone(eventos, routes, etc).

<hr>

*Agradecimentos*: <br>

Além dos materiais encontrados na internet, da aplicação de ambas as tecnologias em projetos pessoais e profissionais na 
[DIV64](http://www.div64.com), das participações nos encontros da nossa maravilhosa comunidade [FloripaJS](https://www.facebook.com/groups/floripajs/), 
a qual está munida de grandes profissionais, gente com sede de conhecimento e de compartilhamento, e também de amigos.<br><br>
Dois caras eu preciso destacar, eles contribuíram bastante para o meu aprendizado, são eles: 
[Gabriel Zigolis](http://www.zigolis.com.br/blog/) e [Sérgio Siqueira](http://sergiorsiqueira.com/),
gente assim faz a diferença na comunidade, agir sem estrelismo e compartilhar a essência do que somos e do que nos fazem cada vez mais profissionais.<br><br> 
**O conhecimento.** <br><br> 

E aí, curtiu? Comente o que achou da junção dessas duas tecnologias ;)


