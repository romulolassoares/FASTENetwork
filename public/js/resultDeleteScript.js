
  const url_string = window.location.href;

  var url = new URL(url_string);
  var result = url.searchParams.get("msg");

  if (result == 'success') {
    toastr.clear()
    toastr.success('Operação realizada com sucesso!', 'Sucesso!')

    document.getElementById('title').innerHTML = "Sucesso"
    document.getElementById('resultado').innerHTML = "A rede foi deletada com sucesso" +
    "<div class='row'>"+
        "<div class='col-lg-5'></div>"+
        "<div class='col-lg-2'>"+
            "<a href='/listarRedes' class='btn btn-light'>Listar Redes</a>"    +
        "</div>"+    
        "<div class='col-lg-5'></div>"+   
    "</div>";

  }
  else if (result == 'error'){
    toastr.clear()
    toastr.error('Ocorreu um erro ao realizar a operação!', 'Erro!')

    document.getElementById('title').innerHTML = "Ocorreu um erro"
    document.getElementById('resultado').innerHTML = "Os dados não foram deletados, tente novamente"+
    "<div class='row'>"+
        "<div class='col-lg-5'></div>"+
        "<div class='col-lg-2'>"+
            "<a href='/listarRedes' class='btn btn-light'>Retornar</a>"    +
        "</div>"+    
        "<div class='col-lg-5'></div>"+   
    "</div>";
  }