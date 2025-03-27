/*
 * Script principal para funcionalidades gerais do site
*/

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar tooltips e popovers do Bootstrap
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Inicializar carrossel com intervalo personalizado
    var carrossel = document.getElementById('carouselPromoções');
    if (carrossel) {
        var carousel = new bootstrap.Carousel(carrossel, {
            interval: 5000,
            wrap: true
        });

        // Pausar o carrossel quando o mouse está sobre ele
        carrossel.addEventListener('mouseenter', function() {
            carousel.pause();
        });

        // Retomar o carrossel quando o mouse sai
        carrossel.addEventListener('mouseleave', function() {
            carousel.cycle();
        });
    }

    // Adicionar animação de entrada para os produtos
    const produtosCards = document.querySelectorAll('.produto-card');

    function verificarVisibilidade() {
        produtosCards.forEach(card => {
            const posicaoTopo = card.getBoundingClientRect().top;
            const alturaTela = window.innerHeight;

            if (posicaoTopo < alturaTela * 0.9) {
                setTimeout(() => {
                    card.classList.add('fade-in');
                }, 100);
            }
        });
    }

    // Executar na carga inicial e durante a rolagem
    verificarVisibilidade();
    window.addEventListener('scroll', verificarVisibilidade);

    // Suavizar a rolagem ao clicar em links de âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const destino = document.querySelector(this.getAttribute('href'));
            if (destino) {
                destino.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Botões de adicionar ao carrinho
    const btnAdicionarCarrinho = document.querySelectorAll('.adicionar-carrinho');

    btnAdicionarCarrinho.forEach(btn => {
        btn.addEventListener('click', function() {
            const produto = this.getAttribute('data-produto');
            const preco = this.getAttribute('data-preco');

            // Adicionar efeito visual ao botão
            this.classList.add('pulse');
            setTimeout(() => {
                this.classList.remove('pulse');
            }, 1000);

            // Mostrar notificação
            mostrarNotificacao(
                'Produto Adicionado',
                `${produto} foi adicionado ao seu carrinho!`,
                'success'
            );
        });
    });
});

/**
 * Função para mostrar notificações usando Toast do Bootstrap
 * @param {string} titulo - Título da notificação
 * @param {string} mensagem - Mensagem da notificação
 * @param {string} tipo - Tipo da notificação (success, warning, danger)
 */
function mostrarNotificacao(titulo, mensagem, tipo = 'info') {
    const toastEl = document.getElementById('notificacaoToast');

    if (toastEl) {
        const toast = new bootstrap.Toast(toastEl);

        // Definir classe de acordo com o tipo
        toastEl.classList.remove('bg-success', 'bg-warning', 'bg-danger', 'bg-info');

        switch (tipo) {
            case 'success':
                toastEl.classList.add('bg-success', 'text-white');
                break;
            case 'warning':
                toastEl.classList.add('bg-warning');
                break;
            case 'danger':
                toastEl.classList.add('bg-danger', 'text-white');
                break;
            default:
                toastEl.classList.add('bg-info', 'text-white');
                break;
        }

        // Atualizar o conteúdo
        document.getElementById('toast-titulo').textContent = titulo;
        document.getElementById('toast-mensagem').textContent = mensagem;

        // Mostrar o toast
        toast.show();
    }
}
