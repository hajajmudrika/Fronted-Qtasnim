<template>
	<div>
		<nav class="navbar navbar-expand-lg navbar-dark bg-dark" data-bs-theme="dark">
			<div class="container">
				<router-link :to="{ name: 'home' }" class="navbar-brand">Home</router-link>
				<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
					aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon" style="color: #e3f2fd;"></span>
				</button>
				<div class="collapse navbar-collapse" id="navbarSupportedContent">
					<ul class="navbar-nav me-auto mb-2 mb-lg-0">
						<li class="nav-item">
							<router-link :to="{ name: 'productTypes.index' }" class="nav-link active" aria-current="page">Product
								Types</router-link>
						</li>
						<li class="nav-item">
							<router-link :to="{ name: 'products.index' }" class="nav-link active"
								aria-current="page">Products</router-link>
						</li>
						<li class="nav-item">
							<router-link :to="{ name: 'transactions.index' }" class="nav-link active"
								aria-current="page">Transactions</router-link>
						</li>
					</ul>
				</div>
			</div>
		</nav>

		<!--- render router view -->
		<router-view></router-view>
	</div>
</template>
