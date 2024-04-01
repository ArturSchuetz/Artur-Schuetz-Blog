<script>
	import GameMain from "./GameMain.svelte";
</script>

<!-- Navbar -->
<nav class="navbar-youplay navbar navbar-default navbar-fixed-top">
	<div class="container">
		<div class="navbar-header">
			<button
				type="button"
				class="navbar-toggle collapsed"
				data-toggle="off-canvas"
				data-target="#navbar"
				aria-expanded="false"
				aria-controls="navbar"
			>
				<span class="sr-only">Toggle navigation</span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</button>
			<a class="navbar-brand" href="index.html"
				><img src="assets/images/shooter/logo.png" alt="" /></a
			>
		</div>
		<div id="navbar" class="navbar-collapse collapse">
			<ul class="nav navbar-nav">
				<li>
					<a href="index.html#demo"
						>Demo <span class="label">Early Edition</span></a
					>
				</li>
			</ul>
		</div>
	</div>
</nav>
<!-- /Navbar -->

<div class="content-wrap">
	<!-- The True Emotions -->
	<section class="container mt-120" id="demo">
		<div class="row">
			<div class="col-xs-12">
				<GameMain></GameMain>
				<h2 class="fs-40">The True Emotions</h2>
				<p class="lead">Test</p>
			</div>
		</div>
	</section>
	<!-- /The True Emotions -->

	<!-- Footer -->
	<footer class="youplay-footer">
		<div class="wrapper">
			<!-- Widgets -->
			<div class="widgets">
				<div class="container">
					<div class="row">
						<div class="col-md-3">
							<div class="side-block">
								<div class="block-content">
									<img
										src="assets/images/shooter/logo.png"
										alt=""
									/>
									<br /><br />
									<p>Placeholder text.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- /Widgets -->

			<!-- Copyright -->
			<div class="copyright">
				<div class="container">
					<p>
						2024 &copy; <strong>Artur Schütz</strong>. All rights
						reserved
					</p>
				</div>
			</div>
			<!-- /Copyright -->
		</div>
	</footer>
	<!-- /Footer -->
</div>

<style>
</style>
